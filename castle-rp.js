require("dotenv").config({ path: __dirname+'/.env' }); //to start process from .env file
// const { channel } = require("diagnostics_channel");
const { Client, Intents, GatewayIntentBits, IntentsBitField, Partials, ChannelType, PermissionFlagsBits, messageLink, Message, User, InteractionCollector, PermissionsBitField  } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, IntentsBitField.Flags.GuildMessages, GatewayIntentBits.MessageContent,], Partials: [], autoReconnect: true})

const { Players } = require("./rpClasses/players.js");
const { Tool } = require("./rpClasses/tool.js");
const { Item } = require("./rpClasses/item.js");
const { Resource } = require("./rpClasses/resource.js");

client.login(process.env.TOKEN);

client.once("ready", () => {
    console.log("I am back online baby.");
});

const locations = ["square", "shop", "hall"];
const shopLocations = ["shop"];
const ore = new Item("Ore", 5);
const oreDeposit = new Resource("Ore Deposit", ore, 10);
const wood = new Item("Wood", 1);
const trees = new Resource("Trees", wood, 5);
const items = [new Tool("Shovel", 100, 10, 1, "Dirt", 10), new Tool("Axe", 100, 10, 1, trees, 15), new Tool("Pickaxe", 100, 10, 1, oreDeposit, 20), new Item("Bread", 2), ore, wood];
const resources = [oreDeposit, trees];

client.on('messageCreate', (msg) => {
    if(!msg.author.bot) {
        if(msg.content.startsWith("!")){
            let message = msg.content.slice(1);
            //join
            if(message.startsWith("join ")){
                message = message.slice(5);
                Players.addPlayer(msg.author.id, message);
                msg.channel.send(`You joined as ${message}`);
            }
            //moveTo
            else if(message.startsWith("moveTo ")){
                message = message.slice(7);
                if(locations.indexOf(message) >= 0){
                    msg.channel.send(`Moving ${msg.author.displayName} to ${message}.`);
                    const userID = msg.author.id;
                    const travelChannel = msg.guild.channels.cache.find(channel => channel.name == "traveling");
                    travelChannel.permissionOverwrites.edit(userID, { ViewChannel: true });
                    msg.channel.permissionOverwrites.edit(userID, { ViewChannel: false });
                    moveUserDelay(userID, travelChannel, msg.guild.channels.cache.find(channel => channel.name == message), 1000);
                            //base delay on grid?
                }
            }
            //buy
            else if(message.startsWith("buy ") && shopLocations.indexOf(msg.channel.name) >= 0){
                message = message.slice(4);
                const index = items.findIndex(item => item.name == message);
                if(index >= 0){
                    const item = items[index];
                    msg.channel.send(`Buying ${item.name} for ${msg.author.displayName}.`);
                    Players.buy(msg.author.id, item);
                }
            }
            //mine
            else if(message.startsWith("mine ") && shopLocations.indexOf(msg.channel.name) >= 0){
                message = message.slice(5);
                const index = resources.findIndex(resource => resource.name == message);
                if(index >= 0){
                    const resource = resources[index];
                    msg.channel.send(`${msg.author.displayName} is mining ${resource.name}.`);
                    Players.mine(resource);
                }
            }
            //showInventory
            else if(message.startsWith("showInventory")){
                const inventory = Players.getPlayer(msg.author.id).items;
                let inventoryStr = "";
                inventory.forEach(item => {
                    inventoryStr += item.name + ", ";
                });
                inventoryStr = inventoryStr.slice(0, -2); 
                msg.channel.send(inventoryStr);
            }
        }
    }
});

async function moveUserDelay(userID, travelChannel, destinationChannel, delayMS) {
    setTimeout(moveUser, delayMS, userID, travelChannel, destinationChannel);
}

async function moveUser(userID, travelChannel, destinationChannel){
    destinationChannel.permissionOverwrites.edit(userID, { ViewChannel: true }); 
    travelChannel.permissionOverwrites.edit(userID, { ViewChannel: false });
}