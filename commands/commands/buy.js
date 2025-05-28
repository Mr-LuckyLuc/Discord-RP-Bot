const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { dbScripts } = require('../../dbScripts');
const { checkUser, filterSortFormat } = require('../commandmethods.js');

module.exports = {
	//for cooldowns see discord.js docs: https://discordjs.guide/additional-features/cooldowns.html
	data: new SlashCommandBuilder()
		.setName('buy')		// make only accesible in certain channels?
		.setDescription('Buy something from the shop')
		.addSubcommand(subcommand =>
			subcommand
			.setName('item')
			.setDescription('Select this if you want to buy an item')
			.addStringOption(option =>
				option.setName('item')
				.setDescription('The item you want to buy')
				.setRequired(true)
				.setAutocomplete(true)
			)
			.addIntegerOption(option =>
				option.setName('amount')
				.setDescription('The amount of this item you want to buy.')
				.setMinValue(1)
			)
		)
		.addSubcommand(subcommand =>
			subcommand
			.setName('tool')
			.setDescription('Select this if you want to buy a tool')
			.addStringOption(option =>
				option.setName('tool')
				.setDescription('The tool you want to buy')
				.setRequired(true)
				.setAutocomplete(true)
			)
		)
		,
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused(true).value;
		let choices;
		if (interaction.options.getSubcommand() === 'item') {
			choices = filterSortFormat(focusedValue, dbScripts.getItems());
		} else if (interaction.options.getSubcommand() === 'tool') {
			choices = filterSortFormat(focusedValue, dbScripts.getTools());
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
					const item = await dbScripts.getItemName(option);
					const amount = interaction.options.getInteger('amount') ? interaction.options.getInteger('amount') : 1;
					if (item) {
						if (player.money >= item.value*amount) {
							for (let i = 0; i < amount; i++) {
								player.items.push(item);
								dbScripts.addPlayer2Item(player.id, item.id);
							}
							player.money -= item.value*amount;
							dbScripts.changePlayerMoney(player.id, player.money);
						}
																																//add buy logic
						await interaction.editReply({ content : `You are buying ${amount} ${item.name}${amount>1?'s':''}.` });
					} else {
						await interaction.editReply({ content : `The item ${option} could not be found, try again.` });
					}
				} else if (interaction.options.getSubcommand() === 'tool') {
					const option = interaction.options.getString('tool');
					const tool = await dbScripts.getToolName(option);
					if (tool) {
						if (player.money >= tool.valuePD*tool.durability) {
							player.tools.push(tool);
							dbScripts.addPlayer2Tool(player.id, tool.id, tool.durability);
							player.money -= Math.round(tool.valuePD*tool.durability);
							dbScripts.changePlayerMoney(player.id, player.money);
						}
						interaction.editReply({ content : `You are buying a ${tool.name}.` });
					} else {
						interaction.editReply({ content : `The tool ${option} could not be found, try again.` });
					}
				}
			} else {
				interaction.editReply({ content : `You are not in a shop location, please move to a shop location before buying anything`});
			}
		});
	},
};