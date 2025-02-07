const { SlashCommandBuilder /*extra*/ } = require('discord.js');

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	data: new SlashCommandBuilder()
		.setName('log')
		.setDescription('logsSlashCommandStructure')
		.addStringOption(option =>
			option.setName('string')
			.setDescription('text')
			.setRequired(true)
			.setChoices(
				{ name: 'name', value: 'value'} //use autocomplete instead?
			)
			// redeploy regurarly for new items?
		)
		.addIntegerOption(option =>
			option.setName('int')
			.setDescription('number')
		)
		,
	async execute(interaction) {
        console.log(interaction);
		console.log(interaction.options);
		console.log(interaction.options.getString('string'));
		await interaction.reply('logged!');
	},
};