const { SlashCommandBuilder /*extra*/ } = require('discord.js');

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
		const focusedValue = interaction.options.getFocused();
		const choices = ['Popular Topics: Threads', 'Sharding: Getting started', 'Library: Voice Connections', 'Interactions: Replying to slash commands', 'Popular Topics: Embed preview'];
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice.toLocaleLowerCase(), value: choice }))
		);
	}
	,
	async execute(interaction) {
		const item = interaction.options.getString('item'); //change to actual item
		const amount = interaction.options.getInteger('amount') ? interaction.options.getInteger('amount') : 1;
																														//add buy logic
		await interaction.reply(`You are buying ${amount} ${item.name} ${amount>1?'s':''}.`);
	},
};