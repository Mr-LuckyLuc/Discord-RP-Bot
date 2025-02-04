const { SlashCommandBuilder /*extra*/ } = require('discord.js');

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	data: new SlashCommandBuilder()
		.setName('mine')
		.setDescription('Mine a resource')
		.addStringOption(option => 
			option.setName('resource')
			.setDescription('Which resource you want to mine.')
			.setRequired(true)
			.setChoices(
				{ name: 'replace', value: 'resource'} //use autocomplete instead?
			)
		)
		,
	async execute(interaction) {
		// const index = resources.findIndex(resource => resource.name == message);
		// if(index >= 0){
		// 	const resource = resources[index];
		// 	msg.channel.send(`${msg.author.displayName} is mining ${resource.name}.`);
		// 	Players.mine(resource);
		// }
		await interaction.reply('You are now mining for resources');
	},
};