const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join the game!')
		.addStringOption(option =>  //get rid of this option? and make it save only id and get nickname every time when mentioning person?
			option.setName('name')
			.setDescription('The name you will get when joining the game')
			.setMinLength(5)
			.setMaxLength(50)
		),
	async execute(interaction) {
		console.log(interaction);
		const username = interaction.options.getString('name') ? interaction.options.getString('name') : interaction.user.globalName;
		console.log(username);
		// Players.addPlayer(msg.author.id, interaction.name);
		await interaction.reply(`You joined as ${username}`);
	},
};