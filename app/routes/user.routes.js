const { authJWT }           = require('../middlewares')
const { verifySignUp }        = require('../middlewares')
const controller            = require('../controllers/user.controller')

module.exports = function (app) {

    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    // Public Access
    app.get('/api/test/all', controller.allAccess)

    // User logged Level Access
    app.get('/api/test/user', [ authJWT.verifyToken ], controller.userBoard)

    // // Moderator Level Access
    // app.get('/moderator', [ authJWT.verifyToken, authJWT.isModerator ], controller.moderatorBoard)

    // Admin Level Access
    app.get('/api/test/admin', [ authJWT.verifyToken, authJWT.isAdmin ], controller.adminBoard)

    // todo: edit profile
    app.put('/api/user/:id/update', [ authJWT.verifyToken, authJWT.isAdmin ], controller.updateProfile_user)
    
    // todo: GET Data User
    app.get('/api/user/:id', [ authJWT.verifyToken, authJWT.isAdmin ], controller.getProfile_user)

    // todo: GET Data Users
    app.get('/api/users/', [ authJWT.verifyToken, authJWT.isAdmin ], controller.getAll_users)

}