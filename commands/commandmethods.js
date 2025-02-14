async function checkUser(interaction, callback, role=null) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const userId = interaction.user.id;
    console.log(userId);
    const user = dbScripts.getPlayer(userId);
    
    if (user) {
        callback(interaction);
    } else {
        await interaction.editReply({ content: "Not a recognised player, user the /join command to join the game!"});
    }
}

function filterSortFormat(filterValue, ...lists) {
    const concattedList = [];
    lists.forEach(list => concattedList.push(...list));
    const stringList = concattedList.map(item => item.name);
    console.log(concattedList);

    let filteredList = stringList.filter(item => {
        console.log(item);
        return item.includes(filterValue);
    });
    console.log(filteredList.length);
    if (filteredList.length > 25) {
        filteredList = filteredList.filter(item => item.startsWith(filterValue));
    }

    return filteredList.map(item => {return { 'name': item, 'value': item };})      //add an alphabetical sort
}

module.exports = {
    checkUser,
    filterSortFormat
}