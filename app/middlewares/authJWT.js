const jwt           = require('jsonwebtoken')
const db            = require('../models')
const config        = require('../configs/auth.config')
const User          = db.user

verifyToken = (req, res, next) => {
    let token =  req.headers["x-access-token"]

    // check if token was in headers of x-access-token, if not send forbidden status code
    if ( !token ) {
        // Forbidden
        return res.status(403).send({
            message: "No token provided!"
        })
    }

    // If token is provided, verify token with JWT
    // Decoded is fetching out the token id that initialized in auth controller
    jwt.verify(token, config.secret, (err, decoded) => {
        if ( err ) {
            // Unauthorized
            return res.status(401).send({
                message: "Unauthorized"
            })
        }

        // Pass req.userId to next middleware
        req.userId = decoded.id
        next()
    })
}

// Check ROLES AUTHORIZED by Primary KEY of user
// Check whether token is provided for admin's user
isAdmin = (req, res, next) => {
    User.findByPk(req.userId)
        .then(user => {
            user.getRoles()
                .then(roles => {
                    for ( let i = 0; i < roles.length; i++ ) {
                        if ( roles[i].name === "admin") {
                            next()
                            return
                        }
                    }
                    
                    res.status(403).send({
                        message: "Require Admin Role!"
                    })
                    return 
                })
                .catch((err) => {
                    res.status(401).send({
                        message: err.message || "Cannot get user roles"
                    })
                })
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Failed! Could not find Id"
            })
        })
}

// isModerator = (req, res, next) => {
//     User.findByPk(req.userId)
//     .then(user => {
//         user.getRoles()
//             .then(roles => {
//                 for ( let i = 0; i < roles.length; i++ ) {
//                     if ( roles[i].name === "moderator") {
//                         next()
//                         return
//                     }
//                 }

//                 res.status(403).send({
//                     message: "Require Moderator Role!"
//                 })
//                 return 
//             })
//             .catch((err) => {
//                 res.status(401).send({
//                     message: err.message || "Cannot get user roles"
//                 })
//             }) 
//     })
//     .catch((err) => {
//         res.status(500).send({
//             message: err.message || "Failed! Could not find Id"
//         })
//     })
// }

// isModeratorOrAdmin = (req, res, next) => {
//     User.findByPk(req.userId)
//     .then(user => {
//         user.getRoles()
//             .then(roles => {
//                 for ( let i = 0; i < roles.length; i++ ) {
//                     if ( roles[i].name === "moderator") {
//                         next()
//                         return
//                     }

//                     if ( roles[i].name === "admin") {
//                         next()
//                         return
//                     }
//                 }

//                 res.status(403).send({
//                     message: "Require Moderator or Admin Role!"
//                 })
//                 return 
//             })
//             .catch((err) => {
//                 res.status(401).send({
//                     message: err.message || "Cannot get user roles"
//                 })
//             }) 
//     })
//     .catch((err) => {
//         res.status(500).send({
//             message: err.message || "Failed! Could not find Id"
//         })
//     })
// }

const authJWT = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    // isModerator: isModerator,
    // isModeratorOrAdmin: isModeratorOrAdmin
}

module.exports = authJWT