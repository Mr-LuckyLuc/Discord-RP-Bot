const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { dbScripts } = require('../../dbScripts');
const { checkUser, filterSortFormat } = require('../commandmethods.js');

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Move to a new location')
		.addStringOption(option => 
			option.setName('destination')
			.setDescription('The destination you want to travel to.')
			.setRequired(true)
			.setAutocomplete(true)
		)
		,
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused(true).value;
		const locations = dbScripts.getLocations();
		const choices = filterSortFormat(focusedValue, locations);
		await interaction.respond(choices);
	}
	,
	async execute(interaction) {
		checkUser(interaction, async (interaction) => {
			await interaction.deferReply();
			const userID = interaction.user.id;
			const channelsCache = interaction.member.guild.channels.cache;
			const origin = channelsCache.find(channel => channel.id == interaction.channelId);
			const destination = channelsCache.find(channel => channel.name == interaction.options.getString('destination'));

			await interaction.editReply({ content: `You are being moved to ${destination.name}`, flags : MessageFlags.Ephemeral });	//check if destination is in list with destinations
			//travel channel perhabs??
			origin.permissionOverwrites.edit(userID, { ViewChannel: false });
			await wait(4)	//base delay on grid?	
			destination.permissionOverwrites.edit(userID, { ViewChannel: true });
			await interaction.followUp({ content: `You have moved to ${destination.name}`, flags : MessageFlags.Ephemeral });
		});
	},
};