const db        = require('../models')
const ROLES     = db.ROLES
const User      = db.user

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if ( user ) {
            res.status(400).send({
                message: "Failed! Username is already in use!"
            })

            return
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message
        })
    })

    // Email
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if ( user ) {
            res.status(400).send({
                message: "Failed! Email is already in use!"
            })
        }

        next()

    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Server error"
        })
    })
}

checkRolesExisted = (req, res, next) => {
    if ( req.body.roles ) {
        for ( let i = 0; i < req.body.roles.length; i++ ) {
            if ( !ROLES.includes(req.body.roles[i]) ) {
                res.status(400).send({
                    message: "Failed! Role does not exist = " + req.body.roles[i]
                })
                return
            }
        }
    }

    next()
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted
}

module.exports = verifySignUp