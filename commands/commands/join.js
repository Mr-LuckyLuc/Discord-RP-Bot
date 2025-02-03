const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join the game!'),
	async execute(interaction) {
        // Players.addPlayer(msg.author.id, message);
        // msg.channel.send(`You joined as ${message}`);
		await interaction.reply('Joined!');
	},
};