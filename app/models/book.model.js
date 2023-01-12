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
            allowNull: false
        },

        summary: {
            type: Sequelize.STRING,
            allowNull: false
        },

    })

    return Book
}