const postgresConfig = require('./config/mysql.json');

const environment = process.env.NODE_ENV || 'development';

module.exports = {
    development: {
        database: postgresConfig[environment].database,
        host: postgresConfig[environment].host,
        username: postgresConfig[environment].username,
        password: postgresConfig[environment].password,
        dialect: 'postgres',
    },
    test: {
        database: postgresConfig[environment].database,
        host: postgresConfig[environment].host,
        username: postgresConfig[environment].username,
        password: postgresConfig[environment].password,
        dialect: 'postgres',
    },
    production: {
        database: postgresConfig[environment].database,
        host: postgresConfig[environment].host,
        username: postgresConfig[environment].username,
        password: postgresConfig[environment].password,
        dialect: 'postgres',
    },
};