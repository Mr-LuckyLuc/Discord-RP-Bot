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
		const items = dbScripts.getItems();														// map these so only name is kept and the property name is name?
		const tools = dbScripts.getTools();
		let filteredItems = items.filter(item => item.itemName.includes(focusedValue));
		let filteredTools = tools.filter(tool => tool.toolName.includes(focusedValue));
		if (filteredItems.length+filteredTools.length > 25) {									// write method for this somehow?
			filteredItems = filteredItems.filter(item => item.itemName.startsWith(focusedValue)); 
			filteredTools = filteredTools.filter(tool => tool.toolName.startsWith(focusedValue));
		}
		const choices = filteredItems.concat(filteredTools); 									//add an alphabetical sort
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

		const userId = interaction.user.id;
		console.log(userId);
		const user = dbScripts.getPlayer(userId);
														//change into method with callbacks?
		if (user) {
			const item = interaction.options.getString('item'); //change to actual item
			const amount = interaction.options.getInteger('amount') ? interaction.options.getInteger('amount') : 1;
																															//add buy logic
			await interaction.editReply({ content: `You are buying ${amount} ${item}${amount>1?'s':''}.` });
		} else {
			await interaction.editReply({ content: "Not a recognised player, user the /join command to join the game!"})
		}
	},
};