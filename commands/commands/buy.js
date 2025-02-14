const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { dbScripts } = require('../../dbScripts');
const { checkUser, filterSortFormat } = require('../commandmethods.js');

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	data: new SlashCommandBuilder()
		.setName('buy')		// make only accesible in certain channels?
		.setDescription('Buy something from the shop')
		.addStringOption(option =>
			option.setName('item')
			.setDescription('The item you want to buy')
			.setRequired(true)
			.setAutocomplete(true)
		)
		.addIntegerOption(option =>
			option.setName('amount')
			.setDescription('The amount of this item you want to buy.')
			.setMinValue(1)
		)
		,
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused(true).value;
		const items = dbScripts.getItems();
		const tools = dbScripts.getTools();
		items.push({id: 2, name: 'stone', value: 5});
		const choices = filterSortFormat(focusedValue, items, tools);
		// const choices = filterAndSort(focusedValue, {list: items, valueName: 'itemName'}, {list: tools, valueName: 'toolName'});
		await interaction.respond(choices);
	}
	,
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		// checkUser(interaction, async (interaction) => {
			const userId = interaction.user.id;
			const option = interaction.options.getString('item');
			const player = await dbScripts.getPlayerId(userId);
			const item = await dbScripts.getItemName(option);
			const tool = await dbScripts.getToolName(option);
			const bought = (item || tool || null);
			console.debug(item);
			const amount = interaction.options.getInteger('amount') ? interaction.options.getInteger('amount') : 1;
			if (bought) {
																														//add buy logic
				await interaction.editReply({ content : `You are buying ${amount} ${bought.name}${amount>1?'s':''}.` });
			} else {
				await interaction.editReply({ content : `The item ${option} could not be found, try again.` });
			}
		// });
	},
};