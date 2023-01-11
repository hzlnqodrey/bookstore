const db        = require('../models')
const config    = require('../configs/auth.config')
const User      = db.user
const Role      = db.role

// Sequelize Query Operators
const Op        = db.Sequelize.Op

// Import Auth Tools
var jwt         = require('jsonwebtoken')
var bcrypt      = require('bcryptjs')

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 12) // 12 -> Salt [Cost Factor] = 2^12
    }).then(user => {
            // Roles was given by Admin [Highest Authority]
            if ( req.body.roles ) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles)
                        .then(() => {
                            res.send({ message: "User was registered successfully" })
                        })
                        .catch((err) => {
                            res.status(500).send({ 
                                message: err.message || "User was failed to register" 
                            })
                        })
                }).catch((err) => {
                    res.status(500).send({
                        message: err.message || "User was failed to register" 
                    })
                })        
            } else {
                // user role = 1
                user.setRoles([1])
                    .then(() => {
                        res.send({ message: "User was registered successfully" })
                    })
                    .catch((err) => {
                        res.status(500).send({
                            message: err.message || "User was failed to register" 
                        })
                    })
            }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "User was failed to register" 
        })
    })
}

exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then((user) => {
        // If not the user, return message
        if ( !user ) {
            return res.status(404).send({ message: "User not found "})
        }

        // Validating Password by comparing between req.body.password and db user.password
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        )

        // Set back access token to null, return accessToken and message
        if ( !passwordIsValid ) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password"
            })
        }

        // If password is right and true, give token for accessing authorized content
        var token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 84600 }) // Expires in 24 hours

        // Get user's roles, and give authorities role back when signing in
        var authorities = []
        user.getRoles()
            .then((roles) => {
                for ( let i = 0; i < roles.length; i++ ) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase())
                }
                res.status(200).send({
                    message: "User was signed in sucessfully",
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token
                })
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "User failed to fetch the given authorities role"
                })
            })

    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Could not get the requested user"
        })
    })
}

// todo: SIGNOUT
exports.signout = async (req, res) => {
    try {
        console.log(req.session)
        req.session = null

        return res.status(200).send({
            message: "You've been signed out!"
        })
    } catch (error) {
        this.next(err)
    }
}

// todo: RESET PASSWORD

// todo: UPDATE PASSWORD