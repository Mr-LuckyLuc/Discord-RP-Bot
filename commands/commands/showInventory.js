const { SlashCommandBuilder /*extra*/ } = require('discord.js');

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	data: new SlashCommandBuilder()
		.setName('show_inventory')
		.setDescription('See all you have collected in your inventory!')
		,
	async execute(interaction) { //maybe 'show' with sub commands?
        //showInventory
		// const inventory = Players.getPlayer(msg.author.id).items;
		// let inventoryStr = "";
		// inventory.forEach(item => {
		// 	inventoryStr += item.name + ", ";
		// });
		// inventoryStr = inventoryStr.slice(0, -2); 
		// msg.channel.send(inventoryStr);
		await interaction.reply('loading inventory');
	},
};