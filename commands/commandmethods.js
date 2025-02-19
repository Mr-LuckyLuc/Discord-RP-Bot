const { dbScripts } = require('../dbScripts');

async function checkUser(interaction, callback) {
    const userId = interaction.user.id;
    const user = await dbScripts.getPlayerId(userId);
    if (user) {
        callback(interaction);
    } else {
        await interaction.editReply({ content: "Not a recognised player, user the /join command to join the game!"});
    }
}

function filterSortFormat(filterValue, list) {
    const stringList = list.map(item => item.name);

    let filteredList = stringList.filter(item => {
        return item.includes(filterValue);
    });
    
    if (filteredList.length > 25) {
        filteredList = filteredList.filter(item => item.startsWith(filterValue));
    }

    return filteredList.map(item => {return { 'name': item, 'value': item };})      //add an alphabetical sort
}

module.exports = {
    checkUser,
    filterSortFormat
}