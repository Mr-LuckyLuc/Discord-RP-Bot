const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { dbScripts } = require('../../dbScripts');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join the game!')
		,
	async execute(interaction) {
		await interaction.deferReply({flags : MessageFlags.Ephemeral})
		const userId = interaction.user.id;
		const joined = await dbScripts.getPlayerId(userId);
		if (joined) interaction.editReply({ content : `You have already joined the game.`});
		else {
			dbScripts.addPlayer({ id : userId, money : 0});	//get a default player acc for new players
			interaction.editReply({ content : `You joined the game.`});
		}
	},
};