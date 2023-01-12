const db                = require('../models')
const sequelize         = db.sequelize
const Sequelize         = db.Sequelize
const Book              = db.book
const Author            = db.author
const Publisher         = db.publisher
const Op                = db.Sequelize.Op
const { QueryTypes }    = require('sequelize')

// Association
// Author - Book

// todo: CREATE AUTHOR
exports.create_author = async (req, res) => {
    try {
        if ( !req.body.name ) {
            return res.status(400).send({
                success: false,
                message: "name cannot be empty"
            })
        }

        const data_author = await Author.create({
            name: req.body.name,
        })

        if ( !data_author ) {
            return res.status(500).send({
                success: false,
                message: "Author could not be created"
            })
        }

        return res.status(200).send({
            success: true,
            message: "Author was successfully created!",
            data: {
                data_author
            }
        })

    } catch (error) {
        return res.status(500).send({
            message: error.message || "There was some error while creating an author."
        })
    }
}

// todo: GET all Authors
exports.findAll_authors = async (req, res) => {
    
    try {
        const data = await Author.findAll()

        return res.status(200).send({
            success: true,
            message: "Authors were successfully retrieved",
            data
        })

    } catch (error) {
        return res.status(500).send({
            message: error.message || "There was some error while fetching Authors from database"
        })
    }

}

// todo: GET a single author
exports.findOne_author = async (req, res) => {
    const id = req.params.id

    try {
        const data = await Author.findByPk(id)
        
        return res.status(200).send({
            success: true,
            message: "Author was successfully retrieved",
            data
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message || "There was some error while fetching Author from database"
        })
    }

}

// todo: POST update an author by the id
exports.update_author = async (req, res) => {
    const id = req.params.id

    // get populated author
    const current_author_data = await Author.findByPk(id)

    // todo: Validating Properties
    if ( !req.userId ) {
        return res.status(401).send({
            success: false,
            message: "User not authorized to make an author"
        })
    }

    try {

        const author = {
            name: req.body.name ? req.body.name : current_author_data.name,
        }

        const data = await Author.update(author, {
            where: { id: id }
        })

        if ( data == 1 ) {
            res.status(200).send({
                success: true,
                message: `Author-ID:${req.params.id} with Name: ${req.body.name} was updated successfully`,
                data

            })
        } else {
            res.status(500).send({
                success: false,
                message: `Cannot update Author with id=${id}. Maybe Author was not found or req.body is empty!`
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message || "There was some error while updating Author to database with id=" + id
        })
    }

}

// todo: POST delete an author
exports.delete_author = async (req, res) => {
    const id = req.params.id

    try {
        const data = await Author.destroy({
            where: { id: id }
        })

        if ( data == 1 ) {
            res.status(200).send({
                success: true,
                message: `author-ID:${req.params.id} was deleted successfully`
            })
        } else {
                success: false,
            res.status(500).send({
                success: false,
                message: `Cannot deleted author with id=${id}. Maybe author was not found or req.body is empty!`
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message || "There was some error while deleting author from database with id=" + id
        })
    }
}

// todo: POST - SEARCH QUERY
exports.search_author = async (req, res) => {
    let SearchValue = ''

    if ( req.body.search ) {
        SearchValue = req.body.search
    } 

    try {
        const Results = await sequelize.query(
            `SELECT * FROM authors WHERE name LIKE '%${SearchValue}%'`, 
            { 
                type: QueryTypes.SELECT,
            }
        )
        
        const NotFoundResults = await sequelize.query(
            `SELECT * FROM authors`, 
            { 
                type: QueryTypes.SELECT
            }
        )

        if ( Results != 0 ) {  
            return res.status(200).send({
                success: true,
                message: "Author(s) were successfully retrieved",
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
            message: error.message || "There was some error while fetching Authors from database"
        })
    }
}