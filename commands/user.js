const { SlashCommandBuilder } = require('@discordjs/builders');
const { userInfo } = require('../database-create.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Do something with our list of users.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a user to our list')
				.addUserOption(option => option.setName('user').setDescription('Pick a user').setRequired(true))
				.addStringOption(option => option.setName('tetrio_id').setDescription('The user ID (NOT the username!!)').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('delete')
				.setDescription('Delete a user from our list')
				.addUserOption(option => option.setName('user').setDescription('Pick a user'))
				.addStringOption(option => option.setName('tetrio_id').setDescription('The user ID (NOT the username!!)')))
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
				.addStringOption(option => option.setName('tetrio_id').setDescription('The TETR.IO user ID (NOT the username!!)'))),
		async execute(interaction) {
			await interaction.deferReply();

			if(interaction.options.getSubcommand() === 'add') {
				const userDiscordID = interaction.options.getUser('user');
				const userTetrioID = interaction.options.getString('tetrio_id');

				if(userTetrioID.length != 24){
					return interaction.editReply('That doesn\'t appear to be a TETR.IO user ID :( make sure you copied the user ID, not the username!');
				}
				
				try {
					const newEntry = await userInfo.create({
						discordID: userDiscordID,
						tetrioID: userTetrioID,
					});

					return interaction.editReply('<@' + newEntry.discordID + '>' + ' was added with the TETR.IO ID ' + newEntry.tetrioID);
				}
				catch(error) {
					if (error.name === 'SequelizeUniqueConstraintError') {
						return interaction.editReply('It appears that user is already in the list.');
					}
					
					return interaction.editReply('Something went wrong while adding that user :(');
				}
			}
			else if(interaction.options.getSubcommand() === 'delete') {
				if (interaction.options.getUser('user')) {
					const userDiscordID = interaction.options.getUser('user');
					const rowCount = await userInfo.destroy({ where: { discordID: userDiscordID}});

					if (!rowCount) return interaction.editReply('That Discord user does not appear to be in the list.');

					return interaction.editReply('User <@' + userDiscordID + '> has been deleted.');
				}
				if (interaction.options.getString('tetrio_id')) {
					const userTetrioID = interaction.options.getString('tetrio_id');
					const rowCount = await userInfo.destroy({ where: { tetrioID: userTetrioID}});

					if (!rowCount) return interaction.editReply('That TETR.IO user does not appear to be in the list.');

					return interaction.editReply('TETR.IO User ' + userTetrioID + ' has been deleted.');
				}
				return interaction.editReply('bruh lmao');
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