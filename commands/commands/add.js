const { SlashCommandBuilder , MessageFlags } = require('discord.js');
const { dbScripts } = require('../../dbScripts');

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('add an item/resource/tool to the game.')       //Need to set the permissions!!
		                                                                //add a subcommand thingy
		,
	async execute(interaction) {
		checkUser(interaction, async (interaction) => {			// figure out modals for this
			await interaction.deferReply();
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