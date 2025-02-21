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
		await interaction.deferReply({ flags : MessageFlags.Ephemeral });
		checkUser(interaction, async (interaction) => {
			const userID = interaction.user.id;
			const channelsCache = interaction.member.guild.channels.cache;
			const origin = channelsCache.find(channel => channel.id == interaction.channelId);
			const channelList = dbScripts.getLocations().map(location => location.name);
			const option = interaction.options.getString('destination');
			if (channelList.includes(option)) {
				const destination = channelsCache.find(channel => channel.name == option);

				await interaction.editReply({ content: `You are being moved to ${destination.name}.` });
				//travel channel perhabs??
				origin.permissionOverwrites.edit(userID, { ViewChannel: false });
				await wait(4000)	//base delay on grid?	
				destination.permissionOverwrites.edit(userID, { ViewChannel: true });
				// await interaction.followUp({ content: `You have moved to ${destination.name}.` });	//useless
			} else {
				await interaction.editReply({ content: `Could not find a location with the name ${option}.` });
			}
		});
	},
};