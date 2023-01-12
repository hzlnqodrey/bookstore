const { authJWT }               = require('../middlewares')
const controller                = require('../controllers/author.controller')
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
    app.post('/api/author/create', [ authJWT.verifyToken, authJWT.isAdmin ], controller.create_author)

    // todo: route to POST update an author by the id
    app.put('/api/author/:id/update', [ authJWT.verifyToken, authJWT.verifyToken ], controller.update_author)

    // todo: route to POST delete an author
    app.delete('/api/author/:id/delete', [ authJWT.verifyToken, authJWT.isAdmin ], controller.delete_author)

    // todo: route to POST - SEARCH QUERY FOR PUBLISHED author
    app.post('/api/author/search', controller.search_author)

    // todo: route to GET - THE NEWEST 10 authorS
    app.get('/api/author/recent',  [ authJWT.verifyToken ], controller.findAllRecent_author)

    // todo: route to GET a single author
    app.get('/api/author/:id', [ authJWT.verifyToken, authJWT.isAdmin ], controller.findOne_author)

    // todo: route to GET all authors
    app.get('/api/authors/', [ authJWT.verifyToken, authJWT.isAdmin ], controller.findAll_authors)
}