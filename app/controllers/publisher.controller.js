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
// Publisher.hasOne(Book, { foreignKey: 'publisher_id'})
// Book.belongsTo(Author, { foreignKey: 'publisher_id', as: 'publisher_info' })

// todo: CREATE Publisher
exports.create_publisher = async (req, res) => {
    try {
        if ( !req.body.name ) {
            return res.status(400).send({
                success: false,
                message: "name cannot be empty"
            })
        }

        const data_publisher = await Publisher.create({
            name: req.body.name,
        })

        if ( !data_publisher ) {
            return res.status(500).send({
                success: false,
                message: "publisher could not be created"
            })
        }

        return res.status(200).send({
            success: true,
            message: "publisher was successfully created!",
            data: {
                data_publisher
            }
        })

    } catch (error) {
        return res.status(500).send({
            message: error.message || "There was some error while creating an publisher."
        })
    }
}

// todo: GET all publishers
exports.findAll_publishers = async (req, res) => {
    
    try {
        const data = await Publisher.findAll()

        return res.status(200).send({
            success: true,
            message: "Publishers were successfully retrieved",
            data
        })

    } catch (error) {
        return res.status(500).send({
            message: error.message || "There was some error while fetching Publishers from database"
        })
    }

}

// todo: GET a single publisher
exports.findOne_publisher = async (req, res) => {
    const id = req.params.id

    try {
        const data = await Publisher.findByPk(id)
        
        return res.status(200).send({
            success: true,
            message: "Publisher was successfully retrieved",
            data
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message || "There was some error while fetching Publisher from database"
        })
    }

}

// todo: POST update an article by the id
exports.update_publisher = async (req, res) => {
    const id = req.params.id

    // get populated article
    const current_publisher_data = await Publisher.findByPk(id)

    // todo: Validating Properties
    if ( !req.userId ) {
        return res.status(401).send({
            success: false,
            message: "User not authorized to make an publisher"
        })
    }

    try {

        const publisher = {
            name: req.body.name ? req.body.name : current_publisher_data.name,
        }

        const data = await Publisher.update(publisher, {
            where: { publisher_id: id }
        })

        if ( data == 1 ) {
            res.status(200).send({
                success: true,
                message: `Publisher-ID:${req.params.id} with Name: ${req.body.name} was updated successfully`,
                data

            })
        } else {
            res.status(500).send({
                success: false,
                message: `Cannot update Publisher with id=${id}. Maybe Publisher was not found or req.body is empty!`
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message || "There was some error while updating Publisher to database with id=" + id
        })
    }

}

// todo: POST delete an article
exports.delete_publisher = async (req, res) => {
    const id = req.params.id

    try {
        const data = await Publisher.destroy({
            where: { publisher_id: id }
        })

        if ( data == 1 ) {
            res.status(200).send({
                success: true,
                message: `publisher-ID:${req.params.id} was deleted successfully`
            })
        } else {
                success: false,
            res.status(500).send({
                success: false,
                message: `Cannot deleted publisher with id=${id}. Maybe publisher was not found or req.body is empty!`
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message || "There was some error while deleting publisher from database with id=" + id
        })
    }
}

// todo: POST - SEARCH QUERY
exports.search_publisher = async (req, res) => {
    let SearchValue = ''

    if ( req.body.search ) {
        SearchValue = req.body.search
    } 

    try {
        const Results = await sequelize.query(
            `SELECT * FROM publishers WHERE name LIKE '%${SearchValue}%'`, 
            { 
                type: QueryTypes.SELECT,
            }
        )
        
        const NotFoundResults = await sequelize.query(
            `SELECT * FROM publishers`, 
            { 
                type: QueryTypes.SELECT
            }
        )

        if ( Results != 0 ) {  
            return res.status(200).send({
                success: true,
                message: "publisher(s) were successfully retrieved",
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
            message: error.message || "There was some error while fetching Publishers from database"
        })
    }
}

// todo: GET - THE NEWEST 10 ARTICLES
exports.findAllRecent_publisher = async (req, res) => {
    try {
        const data = await sequelize.query(
            "SELECT * FROM publishers ORDER BY createdAt DESC LIMIT 5",
            {
                type: QueryTypes.SELECT
            }
        )

        if ( data != 0 ) {  
            return res.status(200).send({
                success: true,
                message: "Recent publisher(s) were successfully retrieved",
                data
            })
        } else {
            return res.status(400).send({
                success: false,
                message: "Bad Request - Cannot get recent publishers"
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message || "There was some error while fetching publishers from database"
        })
    }
}