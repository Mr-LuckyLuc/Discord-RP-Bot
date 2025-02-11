const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { dbScripts } = require('../../dbScripts');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join the game!')
		,
	async execute(interaction) {
		interaction.deferReply();
		console.log(interaction);
		const userId = interaction.user.id;
		console.log(userId);
		const joined = dbScripts.getPlayer(userId);
		if (joined) interaction.reply({ content : `You joined the game.`, flags : MessageFlags.Ephemeral});
		else {
			dbScripts.addPlayer({ playerId : userId, money : 0});	//get a default player acc for new players
			interaction.reply({ content : `You have already joined the game.`, flags : MessageFlags.Ephemeral});
		}
	},
};