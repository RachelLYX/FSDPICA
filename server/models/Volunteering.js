
module.exports = (sequelize, DataTypes) => {
    const Volunteering = sequelize.define("Volunteering", {
        Program: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        Name: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        Contact_Number: {
            type: DataTypes.INTEGER(8),
            allowNull: false
        },
        Date : {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'volunteering'
    });
    return Volunteering;
}