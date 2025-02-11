async function checkUser(interaction, callback) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const userId = interaction.user.id;
    console.log(userId);
    const user = dbScripts.getPlayer(userId);
                                                    //change into method with callbacks?
    if (user) {
        callback();
    } else {
        await interaction.editReply({ content: "Not a recognised player, user the /join command to join the game!"})
    }
}

function sort(filterValue, ...lists) {
    for (list of lists) {
        list.map(item => item.list[list.valueName])
    }
}

module.exports = {
    checkUser,
    sort
}