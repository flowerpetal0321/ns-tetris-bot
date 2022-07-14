const Sequelize = require('sequelize');
const { sequelize } = require('./database-connect.js');

module.exports = {
    userInfo: sequelize.define('userinfo', {
        discordID: {
            type: Sequelize.NUMBER,
            unique: true,
        },
        tetrioID: {
            type: Sequelize.STRING,
            unique: true
        }
    })
}