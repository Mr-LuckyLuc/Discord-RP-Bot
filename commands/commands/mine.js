const { SlashCommandBuilder , MessageFlags } = require('discord.js');
const { dbScripts } = require('../../dbScripts');
const { checkUser, filterSortFormat } = require('../commandmethods.js');

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	cooldown: 60,
	cooldownMessage: `You are to tired to mine again, you can mine again $until.`,
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
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused(true).value;
		const resources = dbScripts.getResources();
		const choices = filterSortFormat(focusedValue, resources);
		await interaction.respond(choices);
	}
	,
	async execute(interaction) {
		checkUser(interaction, async (interaction) => {
			await interaction.deferReply({ flags : MessageFlags.Ephemeral });
			const resource = await dbScripts.getResourceName(interaction.options.getString('resource'));
			if (resource) {
				const player = await dbScripts.getPlayerId(interaction.user.id);
				const tool = player.tools.find(tool => tool.resource == resource);
				if (tool) {
					const amount = Math.floor(resource.lootInterval / tool.damage); 
					dbScripts.addPlayer2Item(player.id, resource.item.id);
					player.items.push(resource.item);
					dbScripts.changeToolDurability(player.id, tool.id, tool.durability, tool.durability-1);
					tool.durability -= 1;
					interaction.editReply({ content : `You you mined a ${resource.name} for ${amount} ${resource.item.name}${amount>1?'s':''}.` });
				} else {
					interaction.editReply({ content : 'You do not have the right tool.' });	
				}
			} else {
				interaction.editReply({ content : 'The resource you want to harvest was not found.' });
			}
		});
	},
};