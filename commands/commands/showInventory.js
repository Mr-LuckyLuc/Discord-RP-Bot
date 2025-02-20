const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { dbScripts } = require('../../dbScripts');
const { checkUser } = require('../commandmethods.js');

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	data: new SlashCommandBuilder()
		.setName('show_inventory')
		.setDescription('See all you have collected in your inventory!')
		,
	async execute(interaction) {	//maybe 'show' with sub commands? like stats? or help?
		await interaction.deferReply({ flags : MessageFlags.Ephemeral });
		checkUser(interaction, async (interaction) => {
			//showInventory
			const player = await dbScripts.getPlayerId(interaction.user.id);
			console.debug(player);
			const items = player.items;														// map these so only name is kept and the property name is name?
			const tools = player.tools;
			console.debug(items);
			let inventoryStr = '';
			inventoryStr += '# Items';
			items.forEach(item => {
				inventoryStr += `\n- Name: ${item.name} Value: ${item.value}`;
			});
			inventoryStr += '\n# Tools';
			inventoryStr += `\n`;
			tools.forEach(tool => {
				inventoryStr += `\n- Name: ${tool.name} Value: ${tool.valuePD*tool.durability}`;
				inventoryStr += `\n\tDurability: ${tool.durability} Damage: ${tool.damage} `; //Resource: ${tool.resource.name}
				inventoryStr += `\n`;
			});
			interaction.editReply(inventoryStr);
		});
	},
};