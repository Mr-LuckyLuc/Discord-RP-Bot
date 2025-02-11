const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { dbScripts } = require('../../dbScripts');

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
		console.log('function');
		const focusedValue = interaction.options.getFocused(true).value;
		const items = dbScripts.getItems();
		const tools = dbScripts.getTools();
		const filteredItems = items.filter(item => item.itemName.includes(focusedValue));
		const filteredTools = tools.filter(tool => tool.toolName.includes(focusedValue));
		if (filteredItems.length+filteredTools.length > 25) {
			filteredItems = items.filter(item => item.itemName.startsWith(focusedValue));
			filteredTools = tools.filter(tool => tool.toolName.startsWith(focusedValue));
		}
		const choices = filteredItems.concat(filteredTools);
		await interaction.respond(
			choices.map(choice => {
				if (choice.itemName) {
					return ({ name: choice.itemName, value: choice.itemName })
				} else if (choice.toolName) {
					return ({ name: choice.toolName, value: choice.toolName })
				}
			})
		);
	}
	,
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		const item = interaction.options.getString('item'); //change to actual item
		const amount = interaction.options.getInteger('amount') ? interaction.options.getInteger('amount') : 1;
																														//add buy logic
		interaction.editReply({ content: `You are buying ${amount} ${item}${amount>1?'s':''}.` });
	},
};