const db                = require('../models')
const sequelize         = db.sequelize
const Sequelize         = db.Sequelize
const Book              = db.book
const Author            = db.author
const Publisher         = db.publisher
const Op                = db.Sequelize.Op
const { QueryTypes }    = require('sequelize')
const { body, validationResult }    = require('express-validator')

// Association
// Author - Book [ONE TO MANY]
Author.hasMany(Book, { foreignKey: 'authorId' })
Book.belongsTo(Author)

// Publisher - Book [One to One]
Publisher.hasOne(Book, { foreignKey: 'publisherId' })
Book.belongsTo(Publisher, { foreignKey: 'publisherId', as: 'publisher_info' })

// todo: CREATE BOOK
exports.create_book = async (req, res) => {
    try {

        if ( !req.body.title ) {
            return res.status(400).send({
                success: false,
                message: "Title cannot be empty"
            })
        }

        if ( !req.body.summary ) {
            return res.status(400).send({
                success: false,
                message: "summary cannot be empty"
            })
        }

        const book = {
            authorId: req.body.authorId,
            publisherId: req.body.publisherId,
            title: req.body.title,
            summary: req.body.summary,
        }

        const data_book = await Book.create(book)

        if ( !data_book ) {
            return res.status(500).send({
                success: false,
                message: "Book could not be created"
            })
        }

        return res.status(200).send({
            success: true,
            message: "Book was successfully created!",
            data: {
                data_book
            }
        })

    } catch (error) {
        return res.status(500).send({
            message: error.message || "There was some error while creating an book."
        })
    }
}

// todo: GET all books
exports.findAll_books = async (req, res) => {
    
    try {
        const data = await Book.findAll({
            include: [
                {
                    model: Author,
                    attributes: ["id", "name"],
                    required: false
                },
                {
                    model: Publisher,
                    as: 'publisher_info',
                    attributes: ["id", "name"],
                    required: false
                }
            ]
        })

        return res.status(200).send({
            success: true,
            message: "Books were successfully retrieved",
            data
        })

    } catch (error) {
        return res.status(500).send({
            message: error.message || "There was some error while fetching Books from database"
        })
    }

}

// todo: GET a single book
exports.findOne_book = async (req, res) => {
    const id = req.params.id

    try {
        const data = await Book.findByPk(id, {
            include: [
                {
                    model: Author,
                    attributes: ["id", "name"],
                    required: false
                },
                {
                    model: Publisher,
                    as: 'publisher_info',
                    attributes: ["id", "name"],
                    required: false
                }
            ]
        })
        
        return res.status(200).send({
            success: true,
            message: "Book was successfully retrieved",
            data
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message || "There was some error while fetching book from database"
        })
    }

}

// todo: POST update an article by the id
exports.update_book = async (req, res) => {
    const id = req.params.id

    // get populated article
    const current_book_data = await Book.findByPk(id)

    // todo: Validating Properties
    if ( !req.userId ) {
        return res.status(401).send({
            success: false,
            message: "User not authorized to make an article"
        })
    }

    try {

        const book = {
            title: req.body.title ? req.body.title : current_book_data.title,
            summary: req.body.summary ? req.body.summary : current_book_data.summary,
        }

        const data = await Book.update(book, {
            where: { id: id }
        })

        if ( data == 1 ) {
            res.status(200).send({
                success: true,
                message: `Book-ID:${req.params.id} with Title: ${req.body.title} was updated successfully`,
                data

            })
        } else {
            res.status(500).send({
                success: false,
                message: `Cannot update book with id=${id}. Maybe book was not found or req.body is empty!`
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message || "There was some error while updating book to database with id=" + id
        })
    }

}

// todo: POST delete an article
exports.delete_book = async (req, res) => {
    const id = req.params.id

    try {
        const data = await Book.destroy({
            where: { id: id }
        })

        if ( data == 1 ) {
            res.status(200).send({
                success: true,
                message: `Book-ID:${req.params.id} was deleted successfully`
            })
        } else {
                success: false,
            res.status(500).send({
                success: false,
                message: `Cannot deleted book with id=${id}. Maybe book was not found or req.body is empty!`
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message || "There was some error while deleting book from database with id=" + id
        })
    }
}

// todo: POST - SEARCH QUERY
exports.search_book = async (req, res) => {
    let SearchValue = ''

    if ( req.body.search ) {
        SearchValue = req.body.search
    } 

    try {
        const Results = await sequelize.query(
            `SELECT * FROM books WHERE title LIKE '%${SearchValue}%'`, 
            { 
                type: QueryTypes.SELECT,
            }
        )
        
        const NotFoundResults = await sequelize.query(
            `SELECT * FROM books`, 
            { 
                type: QueryTypes.SELECT
            }
        )

        if ( Results != 0 ) {  
            return res.status(200).send({
                success: true,
                message: "Book(s) were successfully retrieved",
                Results
            })
        } else {
            return res.status(400).send({
                success: false,
                message: "Bad Request - make it clear what you want to searching for",
                NotFoundResults
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message || "There was some error while fetching books from database"
        })
    }
}