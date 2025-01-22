
const { Item } = require("./item.js");

class Players {

    static playerList = [];

    static defaultUser = {
        id: 0,
        name: "default",
        health: 100,
        money: 100,
        items: [new Item("Bread", 2), new Item("Bread", 2)],
        operation: null
    }

    static addPlayer(name) {
        const index = this.playerList.length;
        this.playerList[index] = this.defaultUser;
        this.playerList[index].id = id;
        this.playerList[index].name = name;
        console.log(this.playerList);
    }

    static getPlayer(id) {
        return this.playerList.find(entry => entry.id == id);
    }

    static addItem(player, item) {
        player.items.push(item);
    }

    static removeItem(player, item) {
        index = player.items.indexOf(item);
        if(index >= 0) {
            player.items.splice(index, 1);
            return true;
        }
        return false
    }

    static buy(id, item) {
        const player = this.getPlayer(id);
        this.addItem(player, item)
        player.money -= item.price;
        console.log(this.playerList);
    }

    static sell(id, item) {
        const player = this.getPlayer(id);
        player.money += item.price;
        this.removeItem(player, item);
        console.log(this.playerList);
    }

    static mine(id, resource){
        const player= Players.getPlayer(id);
        player.operation = resource.mine(player);
    }
}

module.exports = {
    Players
}