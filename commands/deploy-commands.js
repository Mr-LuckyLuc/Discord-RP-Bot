require("dotenv").config({ path: __dirname+'/../.env' }); //to start process from .env file

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command folders from the commands directory you created earlier

const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
		console.log(`loaded ${filePath}`);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

console.log(commands[2]);
commands.forEach(command =>
	command.options.forEach(option => {
		if (option.choices && option.choices[0].name == 'replace') {		//seperate deploy scripts for buy, mine and likewise commands?
			switch (option.choices[0].value) {
				case 'item': //get items and insert
					break;
				case 'resource': //get resources and insert
					break;
			}
		}
		option.choices.shift()
	})
);

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
            // Routes.applicationCommands(process.env.CLIENTID), //for all guilds
			Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();