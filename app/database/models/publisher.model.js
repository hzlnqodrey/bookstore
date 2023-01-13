module.exports = (sequelize, Sequelize) => {
    const Publisher = sequelize.define("publishers", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [2, 50]
            },
        },

    })

    return Publisher
}