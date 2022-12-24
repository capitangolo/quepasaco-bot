const pjson = require('./package.json');
console.log(`Hi, I'm Mapi, ${pjson.name} v${pjson.version}`);

//
// Load Model
console.log("Loading Model…");
const m = require('./model')();


//
// Load Discord
console.log("Loading Discord Bot…");

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection, Partials } = require('discord.js');

//
// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

// Discord Libs
const fs = require('node:fs');
const path = require('node:path');
//
// Load commands
console.log("Loading Discord Commands…");
client.commands = new Collection();
// Read commands
const commandsPath = path.join(__dirname, 'discord_commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  console.log(` - ${file}`);
	const filePath = path.join(commandsPath, file);
	const command = require(filePath)(m);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
// Setup command callback
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//
// Load Events
console.log("Loading Discord Events…");
const eventsPath = path.join(__dirname, 'discord_events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  console.log(` - ${file}`);
	const filePath = path.join(eventsPath, file);
	const event = require(filePath)(m);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
console.log("Logging into Discord…");
client.login(m.c.DISCORD_BOT_TOKEN);
