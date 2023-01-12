require('dotenv').config()
const express           = require('express')
const app               = express()
const PORT              = 5050
const logger            = require('morgan')
const cors              = require('cors')
const cookieSession     = require('cookie-session')

// Import Module
const db        = require('./app/models')
const Role = db.role;

// Test connection | sync to Database 🚀
db.sequelize.sync({ force: false })
    .then(() => {
        console.log("sync to db")
    })
    .catch((error) => {
        console.error("Failed to sync to DB", error)
    })

function initial() {    
    Role.create({
        id: 1,
        name: "user",
        description: "user role - authorized by token"
    });

    Role.create({
        id: 2,
        name: "admin",
        description: "admin role - highest authority"
    });
}
initial()


// MIDDLEWARE
app.use(cors({ origin: "http://localhost:8081" }))
app.use(logger('dev')) // A tiny node debugging utility modeled after node core's debugging technique.
app.use(express.json()) // middleware parsing request of content-type: application/json
app.use(express.urlencoded({ extended: true }))

// Use Session
app.use(
    cookieSession({
        name: "auth-session",
        secret: process.env.COOKIE_SECRET,
        httpOnly: true
    })
)


app.get('/', (req, res) => {
    res.json({
        message: "Welcome to TeDi Application",
    })
})

// Routes
require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
})