const axios = require('axios').default;
const { userInfo } = require('../database-create.js');

module.exports = {
    getData: async (userDiscordID, infoOrRecords, requestedData) => {
        //checking if user exists in the list
        const user = await userInfo.findOne({ where: { discordID: userDiscordID } });
            if (!user) {
                return ('ERROR: user not found');
            }

        //getting all of the user info
        if (infoOrRecords == 'info') {
            if (Date.now() > user.get('userInfoCache')) {
                try {
                    //get data
                    const response = await axios.get('https://ch.tetr.io/api/users/' + user.get('tetrioID'));

                    //write cache info to database
                    const affectedRowsCache = await userInfo.update({ userInfoCache: response.data.cache.cached_until }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsCache) return ('ERROR: something went wrong with writing the cache information to the database');

                    //write username info to database
                    const affectedRowsUsername = await userInfo.update({ username: response.data.data.user.username }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsUsername) return ('ERROR: something went wrong with writing the username information to the database');

                    //write join date (ts) info to the database
                    const affectedRowsJoindate = await userInfo.update({ joindate: response.data.data.user.ts }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsJoindate) return ('ERROR: something went wrong with writing the join date information to the database');

                    //write badge number info to the database
                    const affectedRowsBadgeNumber = await userInfo.update({ badgeNumber: response.data.data.user.badges.length }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsBadgeNumber) return ('ERROR: something went wrong with writing the badge number information to the database');

                    //write xp info to database
                    const affectedRowsXp = await userInfo.update({ xp: response.data.data.user.xp }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsXp) return ('ERROR: something went wrong with writing the xp information to the database');

                    //write gamesplayed info to database
                    const affectedRowsGamesplayed = await userInfo.update({ gamesplayed: response.data.data.user.gamesplayed }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsGamesplayed) return ('ERROR: something went wrong with writing the games played information to the database');

                    //write gameswon info to the database
                    const affectedRowsGameswon = await userInfo.update({ gameswon: response.data.data.user.gameswon }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsGameswon) return ('ERROR: something went wrong with writing the games won information to the database');

                    //write gametime info to database
                    const affectedRowsGametime = await userInfo.update({ gametime: response.data.data.user.gametime }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsGametime) return ('ERROR: something went wrong with writing the game time information to the database');

                    //write leagueGamesplayed info to database
                    const affectedRowsLeagueGamesplayed = await userInfo.update({ leagueGamesplayed: response.data.data.user.league.gamesplayed }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsLeagueGamesplayed) return ('ERROR: something went wrong with writing the league games played information to the database');

                    //write leagueGameswon info to database
                    const affectedRowsLeagueGameswon = await userInfo.update({ leagueGameswon: response.data.data.user.league.gameswon }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsLeagueGameswon) return ('ERROR: something went wrong with writing the league games won information to the database');

                    //write leagueRating info to database
                    const affectedRowsLeagueRating = await userInfo.update({ leagueRating: response.data.data.user.league.rating }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsLeagueRating) return ('ERROR: something went wrong with writing the league rating information to the database');

                    //write leagueRank info to database
                    const affectedRowsLeagueRank = await userInfo.update({ leagueRank: response.data.data.user.league.rank }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsLeagueRank) return ('ERROR: something went wrong with writing the league rank information to the database');

                    //write leagueStanding info to database
                    const affectedRowsLeagueStanding = await userInfo.update({ leagueStanding: response.data.data.user.league.standing }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsLeagueStanding) return ('ERROR: something went wrong with writing the league standing information to the database');

                    //write leaguePercentile info to database
                    const affectedRowsLeaguePercentile = await userInfo.update({ leaguePercentile: response.data.data.user.league.percentile }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsLeaguePercentile) return ('ERROR: something went wrong with writing the league percentile information to the database');

                    //write leagueGlicko info to database
                    const affectedRowsLeagueGlicko = await userInfo.update({ leagueGlicko: response.data.data.user.league.glicko }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsLeagueGlicko) return ('ERROR: something went wrong with writing the league glicko information to the database');

                    //write leagueRD info to database
                    const affectedRowsLeagueRD = await userInfo.update({ leagueRD: response.data.data.user.league.rd }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsLeagueRD) return ('ERROR: something went wrong with writing the league RD information to the database');

                    //write leagueAPM info to database
                    const affectedRowsLeagueAPM = await userInfo.update({ leagueAPM: response.data.data.user.league.apm }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsLeagueAPM) return ('ERROR: something went wrong with writing the league APM information to the database');

                    //write leaguePPS info to database
                    const affectedRowsLeaguePPS = await userInfo.update({ leaguePPS: response.data.data.user.league.pps }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsLeaguePPS) return ('ERROR: something went wrong with writing the league PPS information to the database');
                    
                    //write leagueVS info to database
                    const affectedRowsLeagueVS = await userInfo.update({ leagueVS: response.data.data.user.league.vs }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsLeagueVS) return ('ERROR: something went wrong with writing the league VS information to the database');

                    //write friendcount info to database
                    const affectedRowsFriendcount = await userInfo.update({ friendcount: response.data.data.user.friendcount }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsFriendcount) return ('ERROR: something went wrong with writing the friend count information to the database');

                    console.log(response.data.cache.status);
                } catch (error) {
                    console.error(error);
                    return ('ERROR: something went wrong with getting and storing the data from the TETR.IO API');
                }
            }
        }

        //getting user records
        if (infoOrRecords = 'records') {
            if (Date.now() > user.get('userRecordsCache')) {
                try {
                    //get data
                    const response = await axios.get('https://ch.tetr.io/api/users/' + user.get('tetrioID') + '/records');

                    //write cache info to database
                    const affectedRowsCache = await userInfo.update({ userRecordsCache: response.data.cache.cached_until }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsCache) return ('ERROR: something went wrong with writing the cache information to the database');

                    //write sprintRecord info to database
                    /*const affectedRowsSprintRecord = await userInfo.update({ sprintRecord : response.data.data.records.40l.record.endcontext }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsSprintRecord) return ('ERROR: something went wrong with writing the ~ information to the database');*/

                    //write sprintRank info to database
                    /*const affectedRowsSprintRank = await userInfo.update({ sprintRank: response.data.data.records.40l.rank}, { where: { discordID: userDiscordID } });
                    if (!affectedRowsSprintRank) return ('ERROR: something went wrong with writing the sprint rank information to the database');*/

                    //write blitzRecord info to database
                    const affectedRowsBlitzRecord = await userInfo.update({ blitzRecord: response.data.data.records.blitz.record.endcontext }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsBlitzRecord) return ('ERROR: something went wrong with writing the blitz record information to the database');

                    //write blitzRank info to database
                    const affectedRowsBlitzRank = await userInfo.update({ blitzRank: response.data.data.records.blitz.rank }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsBlitzRank) return ('ERROR: something went wrong with writing the blitz rank information to the database');

                    //write zenLevel info to database
                    const affectedRowsZenLevel = await userInfo.update({ zenLevel: response.data.data.zen.level }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsZenLevel) return ('ERROR: something went wrong with writing the zen level information to the database');

                    //write zenScore info to database
                    const affectedRowsZenScore = await userInfo.update({ zenScore: response.data.data.zen.score }, { where: { discordID: userDiscordID } });
                    if (!affectedRowsZenScore) return ('ERROR: something went wrong with writing the zen score information to the database');

                    console.log(response.data.cache.status);
                } catch (error) {
                    console.error(error);
                    return ('ERROR: something went wrong with getting and storing the data from the TETR.IO API');
                }
            }
        }

        //returning the actual data
        if (!user.get(requestedData)) return;
        return(user.get(requestedData));
    }
}