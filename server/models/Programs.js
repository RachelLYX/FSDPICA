
module.exports = (sequelize, DataTypes) => {
    const Programs = sequelize.define("Programs", {
        Program: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        Venue: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        Time: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        Date : {
            type: DataTypes.TEXT,
            allowNull: false
        },
        Lunch: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'programs'
    });
    return Programs;
}