require('dotenv').config()

module.exports = {
    USER: process.env.USER, 
    HOST: process.env.HOST,
    DATABASE: process.env.DATABASE,
    PASSWORD: process.env.PASSWORD,
    PORT: process.env.PORT, 
    POOL: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 30000
    }
}