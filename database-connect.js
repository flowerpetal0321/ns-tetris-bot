const Sequelize = require('sequelize');
const { identity } = require('lodash');

module.exports = {
    // Connecting to the database
    sequelize: new Sequelize('database', 'username', 'password', {
        host: 'localhost',
        dialect: 'sqlite',
        logging: false,
        storage: 'database.sqlite'
    })
}