module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define("books", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [10, 50]
            },
        },

        summary: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [15, 50]
            },
        },

        authorId: {
            type: Sequelize.INTEGER,
        },

        publisherId: {
            type: Sequelize.INTEGER,
        }

    })

    return Book
}