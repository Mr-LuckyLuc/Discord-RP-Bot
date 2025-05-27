console.log("Starting");

require("dotenv").config({ path: __dirname+'/.env' }); //to start process from .env file

const fs = require('node:fs');
const path = require('node:path');
const express = require('express')
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const {dbScripts} = require('./dbScripts');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.cooldowns = new Collection();

const commandsPath = path.join(path.join(__dirname, "commands"), "commands");
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

dbScripts.load();

for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    dbScripts.load();
  res.status(200).send('Loaded');
});

app.listen(port, () => {
    console.log(`Bot api on port ${port}`)
});

console.log("Logging in to bod");

client.login(process.env.TOKEN);
