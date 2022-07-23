const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Replies with info about the bot.'),
	async execute(interaction) {
		await interaction.reply('This is a bot for NS Tetris, created and maintained by Hya (flowerpetal#4093). This bot is still in development. Please feel free to contact Hya if you have any questions or comments about the bot! You can find the code here: https://github.com/flowerpetal0321/ns-tetris-bot');
	},
};