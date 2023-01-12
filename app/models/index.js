require('dotenv').config()
const Sequelize     = require('sequelize')
const dbConfig      = require('../configs/db.config')

const sequelize = new Sequelize(dbConfig.DATABASE, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: 'postgres',
    port: dbConfig.PORT,
    pool: {
        max     : dbConfig.POOL.max,
        min     : dbConfig.POOL.min,
        acquire : dbConfig.POOL.acquire,
        idle    : dbConfig.POOL.idle
    },
    operatorAliases: false,
    // UTC +07:00 | GMT +7
    dialectOptions: {
        useUTC: false, // for reading from database
        dateStrings: true,
        typeCast: true,
        socketPath: dbConfig.socketPath
    },
    timezone: '+07:00' //for writing to database
})

db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

// USE DB in MODELS
db.user = require('../models/user.model')(sequelize, Sequelize)
db.role = require('../models/role.model')(sequelize, Sequelize)
db.book = require('../models/book.model')(sequelize, Sequelize)
db.author = require('../models/author.model')(sequelize, Sequelize)
db.publisher = require('../models/publisher.model')(sequelize, Sequelize)

// Chaining Many-To-Many Relationship Association with belongToMany
// The association between Users and Roles is Many-to-Many relationship:
// - One User can have many roles
// - One role can be taken by many users
db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
})

db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
})

db.ROLES = ["user", "admin"]

module.exports = db