const { authJWT }               = require('../middlewares')
const controller                = require('../controllers/publisher.controller')
const { body, validationResult } = require('express-validator')

module.exports = function (app) {

    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, origin, Content-Type, Accept"
        )
        next()
    })

    // todo: route to POIST a single
    app.post('/api/publisher/create', [ authJWT.verifyToken, authJWT.isAdmin ], [
        // Validate and sanitize fields.
        body("name", "publisher name must not be empty.")
            .trim()
            .isLength({ min: 1 })
            .escape(),

    ], controller.create_publisher)

    // todo: route to POST update an publisher by the id
    app.put('/api/publisher/:id/update', [ authJWT.verifyToken, authJWT.verifyToken ], controller.update_publisher)

    // todo: route to POST delete an publisher
    app.delete('/api/publisher/:id/delete', [ authJWT.verifyToken, authJWT.isAdmin ], controller.delete_publisher)

    // todo: route to POST - SEARCH QUERY FOR PUBLISHED publisher
    app.post('/api/publisher/search', controller.search_publisher)

    // todo: route to GET a single publisher
    app.get('/api/publisher/:id', [ authJWT.verifyToken, authJWT.isAdmin ], controller.findOne_publisher)

    // todo: route to GET all publishers
    app.get('/api/publishers/', [ authJWT.verifyToken, authJWT.isAdmin ], controller.findAll_publishers)
}