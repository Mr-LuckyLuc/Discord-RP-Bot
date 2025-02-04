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
			.setChoices(
				{ name: 'replace', value: 'item'} //use autocomplete instead?
			)
			// redeploy regurarly for new items?
		)
		.addIntegerOption(option =>
			option.setName('amount')
			.setDescription('The amount of this item you want to buy.')
			.setMinValue(1)
		)
		,
	async execute(interaction) {
		const item = interaction.options.getString('item'); //change to actual item
		const amount = interaction.options.getInteger('amount') ? interaction.options.getInteger('amount') : 1;
																														//add buy logic
		await interaction.reply(`You are buying ${amount} ${item.name} ${amount>1?'s':''}.`);
	},
};