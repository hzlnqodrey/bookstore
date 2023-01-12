const { authJWT }               = require('../middlewares')
const controller                = require('../controllers/book.controller')

module.exports = function (app) {

    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, origin, Content-Type, Accept"
        )
        next()
    })

    // todo: route to POIST a single
    app.post('/api/book/create', [ authJWT.verifyToken, authJWT.isAdmin ], [
            // Validate and sanitize fields.
        body("title", "Title must not be empty.")
            .trim()
            .isLength({ min: 1 })
            .escape(),
        // body("author", "Author must not be empty.")
        //     .trim()
        //     .isLength({ min: 1 })
        //     .escape(),
        body("summary", "Summary must not be empty.")
            .trim()
            .isLength({ min: 1 })
            .escape(),
    ], controller.create_book)

    // todo: route to POST update an book by the id
    app.put('/api/book/:id/update', [ authJWT.verifyToken, authJWT.verifyToken ], controller.update_book)

    // todo: route to POST delete an book
    app.delete('/api/book/:id/delete', [ authJWT.verifyToken, authJWT.isAdmin ], controller.delete_book)

    // todo: route to POST - SEARCH QUERY FOR PUBLISHED book
    app.post('/api/book/search', controller.search_book) // TODO: DISKUSI SAMA SABIK WHETHER QUERY LEWAT ATRIBUT TITLE OR CONTENT

    // todo: route to GET - THE NEWEST 10 bookS
    app.get('/api/book/recent',  [ authJWT.verifyToken ], controller.findAllRecent_books)

    // todo: route to GET a single book
    app.get('/api/book/:id', [ authJWT.verifyToken, authJWT.isAdmin ], controller.findOne_books)

    // todo: route to GET all books
    app.get('/api/books/', [ authJWT.verifyToken, authJWT.isAdmin ], controller.findAll_books)
}