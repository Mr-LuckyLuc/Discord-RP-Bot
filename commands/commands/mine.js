const { SlashCommandBuilder , MessageFlags } = require('discord.js');
const { dbScripts } = require('../../dbScripts');

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
		const resources = dbScripts.getResources();
		const focusedValue = interaction.options.getFocused(true).value;
		let filteredResources = resources.filter(resource => resource.resourceName.includes(focusedValue));
		if (filteredResources.length > 25) {
			filteredResources = filteredResources.filter(resource => resource.resourceName.startsWith(focusedValue));
		}
		const choices = filteredResources;
		await interaction.respond(
			choices.map(choice => ({ name: choice.resourceName, value: choice.resourceName }))
		)
	}
	,
	async execute(interaction) {
		interaction.deferReply();
		// const index = resources.findIndex(resource => resource.name == message);
		// if(index >= 0){
		// 	const resource = resources[index];
		// 	msg.channel.send(`${msg.author.displayName} is mining ${resource.name}.`);
		// 	Players.mine(resource);
		// }
		await interaction.reply({ content: 'You are now mining for resources', flags : MessageFlags.Ephemeral });
	},
};