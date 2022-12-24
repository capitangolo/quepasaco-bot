const pjson = require('./package.json');
console.log(`Hi, I'm Mapi, ${pjson.name} v${pjson.version}`);

// Loading libs
const fs = require('node:fs');
// Require the necessary discord.js classes
const { REST, Routes } = require('discord.js');


//
// Load Model
console.log("Loading Model…");
const m = require('./model')();


//
// Load Discord
console.log("Loading Discord Commands…");

// Reading commands
const commands = [];
const commandFiles = fs.readdirSync('./discord_commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  console.log(` - ${file}`);
	const command = require(`./discord_commands/${file}`)(m);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(m.c.DISCORD_BOT_TOKEN);

// and deploy your commands!
console.log("Registering Discord Commands…");
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(m.c.DISCORD_CLIENT_ID, m.c.DISCORD_GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
