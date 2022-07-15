const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shutdown')
		.setDescription('Shuts down the bot.')
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
		await interaction.reply('Now shutting down the bot.');
        process.exit();
	},
};