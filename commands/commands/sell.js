const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { dbScripts } = require('../../dbScripts');
const { checkUser, filterSortFormat } = require('../commandmethods.js');

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	data: new SlashCommandBuilder()
		.setName('sell')		// make only accesible in certain channels?
		.setDescription('Sell something to the shop')
		.addStringOption(option =>
			option.setName('item')
			.setDescription('The item you want to sell')
			.setRequired(true)
			.setAutocomplete(true)
		)
		.addIntegerOption(option =>
			option.setName('amount')
			.setDescription('The amount of this item you want to sell.')
			.setMinValue(1)
		)
		,
	async autocomplete(interaction) {
		checkUser(interaction, async (interaction) => {
			const focusedValue = interaction.options.getFocused(true).value;
			const items = dbScripts.getPlayerId(interaction.user.id).items;														// map these so only name is kept and the property name is name?
			const tools = dbScripts.getPlayerId(interaction.user.id).tools;
			items.push({itemId: 2, itemName: 'stone', itemValue: 5});
			const choices = filterSortFormat(focusedValue, items, tools);
			await interaction.respond(choices);
		});
	}
	,
	async execute(interaction) {
		checkUser(interaction, async (interaction) => {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
			const userId = interaction.user.id;
			const option = interaction.options.getString('item');
			const amount = interaction.options.getInteger('amount') ? interaction.options.getInteger('amount') : 1;
			const player = await dbScripts.getPlayerId(userId);
			const item = await dbScripts.getItemName(option);
			const tool = await dbScripts.getToolName(option);
			const bought = (item || tool || null);
			if (bought) {
																														//add sell logic
				await interaction.editReply({ content : `You are buying ${amount} ${bought.name}${amount>1?'s':''}.` });
			} else {
				await interaction.editReply({ content : `The item ${option} could not be found, try again.` });
			}
        });
	},
};