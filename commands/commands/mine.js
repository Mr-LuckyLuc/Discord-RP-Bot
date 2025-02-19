const { SlashCommandBuilder , MessageFlags } = require('discord.js');
const { dbScripts } = require('../../dbScripts');
const { checkUser, filterSortFormat } = require('../commandmethods.js');

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	data: new SlashCommandBuilder()
		.setName('mine')
		.setDescription('Mine a resource')
		.addStringOption(option => 
			option.setName('resource')
			.setDescription('Which resource you want to mine.')
			.setRequired(true)
			.setAutocomplete(true)
		)
		,
	async autocomplete() {
		const focusedValue = interaction.options.getFocused(true).value;
		const resources = dbScripts.getResources();
		const choices = filterSortFormat(focusedValue, resources);
		await interaction.respond(choices);
	}
	,
	async execute(interaction) {
		checkUser(interaction, async (interaction) => {
			await interaction.deferReply();
			const resource = dbScripts.getResourceName(interaction.getString('resource'));
			// const index = resources.findIndex(resource => resource.name == message);
			// if(index >= 0){
			// 	const resource = resources[index];
			// 	msg.channel.send(`${msg.author.displayName} is mining ${resource.name}.`);
			// 	Players.mine(resource);
			// }
			await interaction.editReply({ content: 'You are now mining for resources', flags : MessageFlags.Ephemeral });
		});
	},
};