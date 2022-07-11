// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'info') {
		await interaction.reply('This is a bot for NS Tetris, created and maintained by Hya (flowerpetal#4093). This bot is still very very early in development. Please feel free to contact Hya if you have any questions or comments about the bot!');
	}
});

// Login to Discord with your client's token
client.login(token);