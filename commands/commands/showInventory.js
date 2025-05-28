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
			const items = player.items;
			const tools = player.tools;
			let inventoryStr = '';
			inventoryStr += `# Money: ${player.money}`;
			inventoryStr += '\n# Items';
			items.forEach(item => {
				inventoryStr += `\n- **_${item.name}_**`;
				inventoryStr += `\n\tValue: ${item.value}`;
			});
			inventoryStr += '\n# Tools';
			inventoryStr += `\n`;
			tools.forEach(tool => {
				inventoryStr += `\n- **_${tool.name}_**`;
				inventoryStr += `\n\tValue: ${tool.valuePD*tool.durability}`;
				inventoryStr += `\n\tDurability: ${tool.durability}`;
				inventoryStr += `\n\tDamage: ${tool.damage}`;
				inventoryStr += `\n\tResource: ${tool.resource.name}`;
				inventoryStr += `\n`;
			});
			interaction.editReply(inventoryStr);
		});
	},
};