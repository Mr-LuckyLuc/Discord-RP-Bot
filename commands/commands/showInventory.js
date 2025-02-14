const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	data: new SlashCommandBuilder()
		.setName('show_inventory')
		.setDescription('See all you have collected in your inventory!')
		,
	async execute(interaction) {	//maybe 'show' with sub commands? like stats? or help?
		checkUser(interaction, async (interaction) => {
			interaction.deferReply({ flags : MessageFlags.Ephemeral });
			//showInventory
			const items = dbScripts.getPlayerId(interaction.user.id).items;														// map these so only name is kept and the property name is name?
			const tools = dbScripts.getPlayerId(interaction.user.id).tools;
			items.push({itemId: 2, itemName: 'stone', itemValue: 5});

			let inventoryStr = '';
			inventoryStr += '# Items'
			items.forEach(item => {
				inventoryStr += `\n Name: ${item.name} Value: ${item.value}`;
			});
			inventoryStr += '\n# Tools'
			tools.forEach(tool => {
				inventoryStr += `\n Name: ${tool.name} Value: ${tool.value}`;
			});
			interaction.editReply(inventoryStr);
		});
	},
};