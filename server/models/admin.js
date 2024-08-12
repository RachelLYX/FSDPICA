module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("Admin", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        password: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: true,
        }
    }, {
        tableName: 'admin',
        timestamps: false,
    });
    return Admin;
}
