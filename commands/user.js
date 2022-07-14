const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Do something with our list of users.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a user to our list')
				.addUserOption(option => option.setName('user').setDescription('Pick a user').setRequired(true))
				.addStringOption(option => option.setName('tetrio_user_id').setDescription('The user ID (NOT the username!!)').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('delete')
				.setDescription('Delete a user from our list')
				.addUserOption(option => option.setName('user').setDescription('Pick a user'))
				.addStringOption(option => option.setName('tetrio_user_id').setDescription('The user ID (NOT the username!!)')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('leaderboard')
				.setDescription('See our leaderboard!')
				.addStringOption(option =>
					option.setName('statistic')
					.setDescription('Pick which statistic to rank our members by! Defaults to TR.')
					.addChoices(
						{ name: 'Tetra League Rating', value: 'tr' },
						{ name: '40 Lines Sprint', value: '40l' },
					)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('See the list of users that have been registered on our list'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('who')
				.setDescription('Find the Discord username or the TETR.IO username when you specify the other thing.')
				.addUserOption(option => option.setName('user').setDescription('Pick a user'))
				.addStringOption(option => option.setName('tetrio_user_id').setDescription('The user ID (NOT the username!!)'))),
		async execute(interaction) {
			await interaction.deferReply();

			if(interaction.options.getSubcommand() === 'add') {
				await interaction.editReply('user add: this feature hasn\'t been completed yet lol sorry');
			}
			else if(interaction.options.getSubcommand() === 'delete') {
				await interaction.editReply('user delete: this feature hasn\'t been completed yet lol sorry');
			}
			else if(interaction.options.getSubcommand() === 'leaderboard') {
				await interaction.editReply('user leaderboard: this feature hasn\'t been completed yet lol sorry');
			}
			else if(interaction.options.getSubcommand() === 'list') {
				await interaction.editReply('user list: this feature hasn\'t been completed yet lol sorry');
			}
			else if(interaction.options.getSubcommand() === 'who') {
				await interaction.editReply('user who: this feature hasn\'t been completed yet lol sorry');
			}
		}
};