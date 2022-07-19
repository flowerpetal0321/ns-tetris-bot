const { SlashCommandBuilder } = require('@discordjs/builders');
const { userInfo } = require('../database-create.js');
const getData = require('../functions/getData.js');

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
						{ name: 'Join Date', value: 'joindate' },
						{ name: 'Number of Badges', value: 'badgeNumber' },
						{ name: 'XP', value: 'xp' },
						{ name: 'Total Online Games Played', value: 'gamesplayed' },
						{ name: 'Total Online Games Won', value: 'gameswon' },
						{ name: 'Number of Hours', value: 'gametimeHours' },
						{ name: 'Tetra League Games Played', value: 'leagueGamesplayed' },
						{ name: 'Tetra League Games Won', value: 'leagueGameswon' },
						{ name: 'Tetra League Win Rate', value: 'tlwinrate' },
						{ name: 'Tetra League Rating', value: 'leaugeRating' },
						{ name: 'Tetra League Rating Deviation', value: 'leagueRD' },
						{ name: 'Tetra League APM', value: 'leagueAPM' },
						{ name: 'Tetra League PPS', value: 'leaguePPS' },
						{ name: 'Tetra League VS', value: 'leagueVS' },
						{ name: 'Tetra League VS/APM', value: 'vsapm'},
						{ name: 'Tetra League APP', value: 'app'},
						{ name: 'Friend Count', value: 'friendcount' },
						{ name: '40 Lines Sprint PB', value: 'sprintRecord' },
						{ name: 'Blitz PB', value: 'blitzRecord' },
						{ name: 'Zen Level', value: 'zenLevel' }
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
					const userUsername = await getData.getData(userDiscordID, 'info', 'username');
					return interaction.editReply(`<@${newEntry.discordID}> was added with the TETR.IO ID ${newEntry.tetrioID} (username: ${userUsername})`);
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
				const requestedStat = interaction.options.getString('statistic');
				const userList = await userInfo.findAll({ attributes: ['discordID']});
				const userListWithStats = [];

				//user info with only one stat listed
				if(['joindate', 'badgeNumber', 'gamesplayed', 'gameswon', 'leagueGamesplayed', 'leagueGameswon', 'leagueRD', 'leagueAPM', 'leaguePPS', 'leagueVS', 'friendcount', 'gametimeHours', 'tlwinrate', 'vsapm', 'app'].includes(requestedStat)){
					//declare class
					class UserPlusInfo {
						constructor(discordID, username, stat, rank) {
							this.discordID = discordID;
							this.username = username;
							this.stat = stat;
							this.rank = rank;
						}
					}

					for (i in userList) {
						//get username
						const userUsername = await getData.getData(userList[i].discordID, 'info', 'username');

						//declare userStat
						let userStat;

						//writing onto userStat when pure user info
						if (['joindate', 'badgeNumber', 'gamesplayed', 'gameswon', 'leagueGamesplayed', 'leagueGameswon', 'leagueRD', 'leagueAPM', 'leaguePPS', 'leagueVS', 'friendcount'].includes(requestedStat)) {
							userStat = await getData.getData(userList[i].discordID, 'info', requestedStat);
						}
						//writing onto userStat when not pure
						else if (requestedStat == 'gametimeHours') {
							const gametimeSeconds = await getData.getData(userList[i].discordID, 'info', 'gametime');
							userStat = gametimeSeconds / 3600;
						}
						else if (requestedStat == 'tlwinrate') {
							const gameswon = await getData.getData(userList[i].discordID, 'info', 'leagueGameswon');
							const totalgames = await getData.getData(userList[i].discordID, 'info', 'leagueGamesplayed');
							if (gameswon == 0 || totalgames == 0) {
								break;
							}
							userStat = gameswon / totalgames * 100 + '%';
						}
						else if (requestedStat == 'vsapm') {
							const leagueVS = await getData.getData(userList[i].discordID, 'info', 'leagueVS');
							const leagueAPM = await getData.getData(userList[i].discordID, 'info', 'leagueAPM');
							if (!leagueVS || !leagueAPM) {
								break;
							}
							userStat = leagueVS / leagueAPM;
						}
						else if (requestedStat == 'app') {
							const leagueAPM = await getData.getData(userList[i].discordID, 'info', 'leagueAPM');
							const leaguePPS = await getData.getData(userList[i].discordID, 'info', 'leaguePPS');
							if (!leagueAPM || !leaguePPS) {
								break;
							}
							userStat = leagueAPM / leaguePPS / 60;
						}

						//writing onto array of user+stats, and handling any null stats
						if (['joindate', 'badgeNumber', 'gamesplayed', 'gameswon', 'leagueGamesplayed', 'leagueGameswon', 'friendcount', 'gametimehours'].includes(requestedStat) && !userStat) {
							const userObject = new UserPlusInfo(userList[i].discordID, userUsername, 0);
							userListWithStats.push(userObject);
						}
						else if (['leagueRD', 'leagueAPM', 'leaguePPS', 'leagueVS', 'tlwinrate', 'vsapm', 'app'].includes(requestedStat) && !userStat) {
							//don't do anything
						}
						else if (userStat == -1) {
							//don't do anything
						}
						else {
							const userObject = new UserPlusInfo(userList[i].discordID, userUsername, userStat);
							userListWithStats.push(userObject);
						}
					}

					//sort greatest to least
					if (['badgeNumber', 'gamesplayed', 'gameswon', 'leagueGamesplayed', 'leagueGameswon', 'leagueRD', 'leagueAPM', 'leaguePPS', 'leagueVS', 'friendcount', 'gametimeHours', 'tlwinratet', 'vsapm', 'app'].includes(requestedStat)) {
						userListWithStats.sort((a, b) => b.stat - a.stat);
					}
					//sort least to greatest
					else if (['jointime'].includes(requestedStat)) {
						userListWithStats.sort((a, b) => a.stat - b.stat);
					}

					//give each person a rank
					let currentRank = 1;
					for (i in userListWithStats) {
						//when the first one in the list
						if (i == 0) {
							userListWithStats[i].rank = 1;
						}
						//when same as previous
						else if (userListWithStats[i].stat == userListWithStats[i - 1].stat) {
							userListWithStats[i].rank = currentRank;
						}
						//when different than previous
						else {
							currentRank++;
							userListWithStats[i].rank = currentRank;
						}
					}

					//print!!!!
					const listString = userListWithStats.map(t => `${t.rank}. ${t.discordID} (${t.username}): ${t.stat}`).join('\n') || 'I couldn\'t find any users to rank.';
					return interaction.editReply(`**Leaderboard for ${interaction.options.getString('statistic')}:**\n${listString}`);
				}

				//leaderboard for xp
				if(requestedStat == 'xp'){
					//declare class
					class UserPlusInfo {
						constructor(discordID, username, level, xp, rank) {
							this.discordID = discordID;
							this.username = username;
							this.level = level;
							this.xp = xp;
							this.rank = rank;
						}
					}

					for (i in userList) {
						//get username
						const userUsername = await getData.getData(userList[i].discordID, 'info', 'username');

						//writing onto user stats
						const userXP = await getData.getData(userList[i].discordID, 'info', 'xp');
						let weirdMaxThing = (userXP - 4000000) / 5000;
						if (weirdMaxThing < 0) weirdMaxThing = 0;
						const userLevel = Math.floor(Math.pow(userXP / 500, 0.6) + userXP / (5000 + weirdMaxThing) + 1);

						//writing onto array of user+stats
						const userObject = new UserPlusInfo(userList[i].discordID, userUsername, userLevel, userXP);
						userListWithStats.push(userObject);

						//sort greatest to least
						userListWithStats.sort((a, b) => b.xp - a.xp);
					}

					//give each person a rank
					let currentRank = 1;
					for (i in userListWithStats) {
						//when the first one in the list
						if (i == 0) {
							userListWithStats[i].rank = 1;
						}
						//when same as previous
						else if (userListWithStats[i].xp == userListWithStats[i - 1].xp) {
							userListWithStats[i].rank = currentRank;
						}
						//when different than previous
						else {
							currentRank++;
							userListWithStats[i].rank = currentRank;
						}
					}

					const listString = userListWithStats.map(t => `${t.rank}. ${t.discordID} (${t.username}): Level ${t.level} (${t.xp} xp)`).join('\n') || 'I couldn\'t find any users to rank.';
					return interaction.editReply(`**Leaderboard for ${interaction.options.getString('statistic')}:**\n${listString}`);
				}

				if(requestedStat == 'leagueRating'){
					//
				}

				//user records
				if(['sprintRecord', 'blitzRecord', 'zenLevel'].includes(requestedStat)){
					//
				}

				return interaction.editReply('this feature hasn\'t been completed yet lol sorry');
			}
			else if(interaction.options.getSubcommand() === 'list') {
				const userList = await userInfo.findAll({ attributes: ['discordID', 'tetrioID']});
				const userListWithUsername = [];
				for(i in userList){
					userListWithUsername.push({
						discordID: userList[i].discordID,
						tetrioID: userList[i].tetrioID,
						username: await getData.getData(userList[i].discordID, 'info', 'username')
					});
				}
				const listString = userListWithUsername.map(t => `${t.discordID} ${t.tetrioID} (${t.username})`).join('\n') || 'There are no users in the list.';
				return interaction.editReply(`**List of everyone:**\n${listString}`);
			}
			else if(interaction.options.getSubcommand() === 'who') {
				if (interaction.options.getUser('user') && interaction.options.getString('tetrio_id')) {
					return interaction.editReply('Only specify one of the fields please.')
				}
				if (interaction.options.getUser('user')) {
					const userDiscordID = interaction.options.getUser('user');
					const userTetrioID = await getData.getData(userDiscordID, 'neither', 'tetrioID');
					const userUsername = await getData.getData(userDiscordID, 'info', 'username');

					if (userTetrioID == 'ERROR: user not found') {
						return interaction.editReply('That user is not on the list :(')
					}

					return interaction.editReply(`That user\'s TETR.IO username is ${userUsername}. You can find their TETR.IO profile at https://ch.tetr.io/u/${userTetrioID}`);
				}
				if (interaction.options.getString('tetrio_id')) {
					const userTetrioID = interaction.options.getString('tetrio_id');
					const user = await userInfo.findOne({ where: { tetrioID: userTetrioID } });
					if (!user) {
						return interaction.editReply(`That user is not in the list :(`);
					}
					return interaction.editReply(`That user is ${user.get('discordID')} on Discord`);
				}
				return interaction.editReply('Please specify one of the fields.');
			}
		}
};