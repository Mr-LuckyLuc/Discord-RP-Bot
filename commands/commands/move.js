const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Move to a new location')
		.addStringOption(option => 
			option.setName('destination')
			.setDescription('The destination you want to travel to.')
			.setChoices(
				{ name: 'replace', value: 'channels'}
			)
		)
		,
	async execute(interaction) {
		interaction.deferReply();
		const userID = interaction.user.id;
		const channelsCache = interaction.member.guild.channels.cache;
		const origin = channelsCache.find(channel => channel.id == interaction.channelId);	//need to get this when this is another channel
		const destination = channelsCache.find(channel => channel.name == interaction.options.getString('destination'));

		await interaction.reply({ content: `You are being moved to ${destination.name}`, flags : MessageFlags.Ephemeral });	//check if destination is in list with destinations
		//travel channel perhabs??
		origin.permissionOverwrites.edit(userID, { ViewChannel: false }); //how to get channel from interaction?
		await wait(4_000)	//base delay on grid?	
		destination.permissionOverwrites.edit(userID, { ViewChannel: true });
		await interaction.followUp({ content: `You have moved to ${destination.name}`, flags : MessageFlags.Ephemeral });
	},
};