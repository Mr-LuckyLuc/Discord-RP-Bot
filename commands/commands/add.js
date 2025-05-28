const { SlashCommandBuilder , MessageFlags } = require('discord.js');
const { dbScripts } = require('../../dbScripts');

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('add something to the game.')       			//Need to set the permissions!!
		.addSubcommand(subcommand =>
			subcommand
			.setName('location')
			.setDescription('Select this if you want to add a location')
			.addChannelOption(option =>
				option.setName('name')
				.setDescription('The channel to add')
				.setRequired(true)
			)
			.addBooleanOption(option =>
				option.setName('shop')
				.setDescription('If this locations should be considered a shop or not')
			)
		)
		.addSubcommand(subcommand =>
			subcommand
			.setName('item')
			.setDescription('Select this if you want to add an item')
			.addStringOption(option =>
				option.setName('name')
				.setDescription('The name of the new item')
				.setRequired(true)
			)
			.addIntegerOption(option =>
				option.setName('value')
				.setDescription('The value of the new item')
				.setRequired(true)
			)
		)
		.addSubcommand(subcommand =>
			subcommand
			.setName('resource')
			.setDescription('Select this if you want to add a resource')
			.addStringOption(option =>
				option.setName('name')
				.setDescription('The name of the new resource')
				.setRequired(true)
			)
			.addIntegerOption(option =>
				option.setName('interval')
				.setDescription('The amount of damage that needs to be done to this resource for it to drop it\'s item')
				.setRequired(true)
			)
			.addStringOption(option =>
				option.setName('item')
				.setDescription('The item that drops when collecting this resource')
				.setRequired(true)
				.setAutocomplete(true)
			)
		)
		.addSubcommand(subcommand =>
			subcommand
			.setName('tool')
			.setDescription('Select this if you want to sell an item')
			.addStringOption(option =>
				option.setName('item')
				.setDescription('The item you want to sell')
				.setRequired(true)
				.setAutocomplete(true)
			)
		)
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

// This file is hidden using gitignore, remember