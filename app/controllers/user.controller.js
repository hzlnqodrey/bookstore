const db            = require('../models/index')
const User          = db.user
const sequelize     = db.sequelize

var jwt         = require('jsonwebtoken')
var bcrypt      = require('bcryptjs')

// /api/test/all for public access
exports.allAccess = (req, res) => {
    res.status(200).send("Public Content")
}

// /api/test/user for loggedin users (role: user |or| moderator |or| admin)
exports.userBoard = (req, res) => {
    res.status(200).json({message: "User Content", decodedToken: req.userId }) // User related content
}

// /api/test/admin for users having admin role
exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content") // Can access anything
}

// todo: GET USERS DATA [FOR DASHBOARD INFO]
exports.getAll_users = async (req, res) => {
    try {
        const users_data = await User.findAll()

        return res.status(200).send({
            success: true,
            message: "Users were successfully retrieved",
            users_data
        })
    } catch (error) {
        res.status(500).send({
            message: err.message || "Could not get the requested users"
        })
    }
}

// todo: GET USER DATA [USER INDIVIDUAL INFO]
exports.getProfile_user = async (req, res) => {
    const id = req.params.id

    try {
        const user_data = await User.findOne({
            where: {
                id: id
            }
        })

        if ( user_data != null ) {
            return res.status(200).send({
                success: true,
                message: `User's data with ID-${req.params.id} was successfully retrieved`,
                user_data
            })
        } else {
            return res.status(400).send({
                message: "Bad Request - Could not get user's data. Maybe user was not found or req.params.id is empty!"
            })
        }

    } catch (error) {
        res.status(500).send({
            message: err.message || "Could not get the requested users"
        })
    }
}

// todo: EDIT PROFILE
exports.updateProfile_user = async (req, res) => {
    
    const id = req.params.id

    // get populated user
    const current_user = await User.findByPk(id)

    // Validating File | not required it's fine i guess
    const file = req.file ? req.file : null

    // Validating Password
    let samePassword = ''

    if ( req.body.newPassword === req.body.confirmNewPassword) {
        samePassword = req.body.newPassword
    } else {
        return res.status(400).send({
            message: "New password and confirmed password is not same!"
        })
    }

    try {

        const user = {
            name: req.body.name ? req.body.name : current_user.name,
            username: req.body.username ? req.body.username : current_user.username,
            email: req.body.email ? req.body.email : current_user.email,
            password: req.body.newPassword && req.body.confirmNewPassword ? bcrypt.hashSync(samePassword, 12) : current_user.password, // 12 -> Salt [Cost Factor] = 2^12
        }
        
        const updatedUserProfile = await User.update(user, {
            where: {
                id: id
            }
        })

        if ( updatedUserProfile == 1 ) {
            res.status(200).send({
                success: true,
                message: `User-ID:${req.params.id} was updated successfully`,
                updatedUserProfile

            })
        } else {
            res.status(500).send({
                message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`
            })
        }


    } catch (error) {
        res.status(500).send({
            message: error.message || "There was some error while updating user to database with id=" + id
        })
    }

}