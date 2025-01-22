
const { Players } = require("./players.js");

class Resource {
    name;
    item;
    lootInterval;

    constructor(name, item, lootInterval) {
        this.name = name;
        this.item = item;
        this.lootInterval = lootInterval;
    }

    async mine(player) {
        const tool = player.items.find(item => {item.target == this})
        const interval = setInterval((r) => {
            for(r += tool.damage; r > lootInterval; r -= lootInterval){
                Players.addItem(item, player);
            }
        
            if (--tool.durability==0) {
                clearInterval(interval);
            }
        }, this.speed);
        return interval;
    }
}

module.exports = {
    Resource
}