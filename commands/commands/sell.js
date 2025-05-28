const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { dbScripts } = require('../../dbScripts');
const { checkUser, filterSortFormat } = require('../commandmethods.js');

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	data: new SlashCommandBuilder()
		.setName('sell')		// make only accesible in certain channels?
		.setDescription('Sell something to the shop')
		.addSubcommand(subcommand =>
			subcommand
			.setName('item')
			.setDescription('Select this if you want to sell an item')
			.addStringOption(option =>
				option.setName('item')
				.setDescription('The item you want to sell')
				.setRequired(true)
				.setAutocomplete(true)
			)
			.addIntegerOption(option =>
				option.setName('amount')
				.setDescription('The amount of this item you want to sell.')
				.setMinValue(1)
			)
		)
		.addSubcommand(subcommand =>
			subcommand
			.setName('tool')
			.setDescription('Select this if you want to sell a tool')
			.addStringOption(option =>
				option.setName('tool')
				.setDescription('The tool you want to sell')
				.setRequired(true)
				.setAutocomplete(true)
			)
			.addIntegerOption(option =>
				option.setName('durability')
				.setDescription('The durability of the tool you want to sell.')		//find a wat to change maxValue at runtime?
				.setAutocomplete(true)
				.setMinValue(1)
			)
		)
		,
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused(true).value;
		const player = await dbScripts.getPlayerId(interaction.user.id);
		let choices;
		if (interaction.options.getSubcommand() === 'item') {
			const items = player.items;
			choices = filterSortFormat(focusedValue, items);
		} else if (interaction.options.getSubcommand() === 'tool') {
			const focusedOption = interaction.options.getFocused(true);
			if (focusedOption.name === 'tool') {
				choices = filterSortFormat(focusedValue, player.tools);
			} else {
				tools = player.tools.filter(tool => tool.name === interaction.options.getString('tool'));
				const unformatted = tools.filter(tool => tool.durability.toString().includes(focusedValue));
				choices = unformatted.map(tool => {
					return { name : tool.durability, value : tool.durability };
				});
			}
		}
		await interaction.respond(choices);
	}
	,
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		checkUser(interaction, async (interaction) => {
			if ((await dbScripts.getLocationId(interaction.channelId)).isShop) {
				const userId = interaction.user.id;
				const player = await dbScripts.getPlayerId(userId);
				if (interaction.options.getSubcommand() === 'item') {
					const option = interaction.options.getString('item');
					const list = player.items.filter(playerItem => playerItem.name === option);
					const amount = interaction.options.getInteger('amount') ? interaction.options.getInteger('amount') : 1;
					if (list.length >= amount) {
						const item = list[0];
						for (let i = 0; i < amount; i++) {
							player.items.pop(item);
							dbScripts.deletePlayer2Item(player.id, item.id);
						}
						player.money += item.value*amount;
						dbScripts.changePlayerMoney(player.id, player.money);
						await interaction.editReply({ content : `You are selling ${amount} ${item.name}${amount>1?'s':''}.` });
					} else if (list.length) {
						await interaction.editReply({ content : `You do not have ${amount} ${option}${amount>1?'s':''} to sell, you only have ${list.length}.` });
					} else {
						await interaction.editReply({ content : `The item ${option} could not be found, try again.` });
					}
				} else if (interaction.options.getSubcommand() === 'tool') {
					const option = interaction.options.getString('tool');
					const toolDurability = interaction.options.getInteger('durability');
					const tool = player.tools.find(tool => tool.name === option && tool.durability === toolDurability)
					if (tool) {
						player.tools.pop(tool);
						dbScripts.deletePlayer2Tool(player.id, tool.id, tool.durability);
						player.money += Math.round(tool.valuePD*tool.durability);
						dbScripts.changePlayerMoney(player.id, player.money);
						await interaction.editReply({ content : `You are selling a ${tool.name}.` });
					} else {
						await interaction.editReply({ content : `The tool ${option} could not be found, try again.` });
					}
				}
			} else {
				interaction.editReply({ content : `You are not in a shop location, please move to a shop location before selling anything`});
			}
        });
	},
};