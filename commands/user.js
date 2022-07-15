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
					const user = await userInfo.findOne({ where: { discordID: userDiscordID } });
					const userTetrioID = user.get('tetrioID');
					const rowCount = await userInfo.destroy({ where: { discordID: userDiscordID } });

					if (!rowCount) return interaction.editReply('That Discord user does not appear to be in the list.');

					return interaction.editReply(`User ${userDiscordID}, who was linked to ${userTetrioID}, has been deleted.`);
				}
				if (interaction.options.getString('tetrio_id')) {
					const userTetrioID = interaction.options.getString('tetrio_id');
					const user = await userInfo.findOne({ where: { tetrioID: userTetrioID } });
					const userDiscordID = user.get('discordID');
					const rowCount = await userInfo.destroy({ where: { tetrioID: userTetrioID } });

					if (!rowCount) return interaction.editReply('That TETR.IO user does not appear to be in the list.');

					return interaction.editReply(`TETR.IO User ${userTetrioID}, who was linked to ${userDiscordID}, has been deleted.`);
				}
				return interaction.editReply('You have to specify someone to delete smh');
			}
			else if(interaction.options.getSubcommand() === 'leaderboard') {
				await interaction.editReply('user leaderboard: this feature hasn\'t been completed yet lol sorry');
			}
			else if(interaction.options.getSubcommand() === 'list') {
				const userList = await userInfo.findAll({ attributes: ['discordID', 'tetrioID']});
				const listString = userList.map(t => `${t.discordID} ${t.tetrioID}`).join('\n') || 'There are no users in the list.';
				return interaction.editReply(`List of everyone: ${listString}`);
			}
			else if(interaction.options.getSubcommand() === 'who') {
				if (interaction.options.getUser('user') && interaction.options.getString('tetrio_id')) {
					return interaction.editReply('Only specify one of the fields please.')
				}
				if (interaction.options.getUser('user')) {
					const userDiscordID = interaction.options.getUser('user');
					const user = await userInfo.findOne({ where: { discordID: userDiscordID } });
					return interaction.editReply(`That user\'s TETR.IO ID is ${user.get('tetrioID')}. You can find their TETR.IO profile at https://ch.tetr.io/u/${user.get('tetrioID')}`);
				}
				if (interaction.options.getString('tetrio_id')) {
					const userTetrioID = interaction.options.getString('tetrio_id');
					const user = await userInfo.findOne({ where: { tetrioID: userTetrioID } });
					return interaction.editReply(`That user is ${user.get('discordID')} on Discord`);
				}
				return interaction.editReply('Please specify one of the fields.');
			}
		}
};