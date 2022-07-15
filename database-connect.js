const Sequelize = require('sequelize');
const { identity } = require('lodash');
const { databaseHost } = require('./config.json');

module.exports = {
    // Connecting to the database
    sequelize: new Sequelize('database', 'user', 'password', {
        host: databaseHost,
        dialect: 'sqlite',
        logging: false,
        storage: 'database.sqlite',
    })
}