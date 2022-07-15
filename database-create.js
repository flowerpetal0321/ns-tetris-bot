const Sequelize = require('sequelize');
const { sequelize } = require('./database-connect.js');

module.exports = {
    userInfo: sequelize.define('userinfo', {
        discordID: { type: Sequelize.NUMBER, unique: true },
        tetrioID: { type: Sequelize.STRING, unique: true },
        userInfoCache: { type: Sequelize.INTEGER },
        userRecordsCache: { type: Sequelize.INTEGER },
        //below is user info
        username: { type: Sequelize.STRING },
        joindate: { type: Sequelize.STRING },
        badgeNumber: { type: Sequelize.INTEGER },
        xp: { type: Sequelize.FLOAT },
        gamesplayed: { type: Sequelize.INTEGER },
        gameswon: { type: Sequelize.INTEGER },
        gametime: { type: Sequelize.FLOAT },
        leagueGamesplayed: { type: Sequelize.INTEGER },
        leagueGameswon: { type: Sequelize.INTEGER },
        leagueRating: { type: Sequelize.FLOAT },
        leagueRank: { type: Sequelize.STRING },
        leagueStanding: { type: Sequelize.STRING },
        leaguePercentile: { type: Sequelize.FLOAT },
        leagueGlicko: { type: Sequelize.FLOAT },
        leagueRD: { type: Sequelize.FLOAT },
        leagueAPM: { type: Sequelize.FLOAT },
        leaguePPS: { type: Sequelize.FLOAT },
        leagueVS: { type: Sequelize.FLOAT },
        friendcount: { type: Sequelize.INTEGER },
        //below is user records
        sprintRecord: { type: Sequelize.FLOAT },
        sprintRank: { type: Sequelize.INTEGER },
        blitzRecord: { type: Sequelize.FLOAT },
        blitzRank: { type: Sequelize.INTEGER },
        zenLevel: { type: Sequelize.INTEGER },
        zenScore: { type: Sequelize.INTEGER },
    })
}