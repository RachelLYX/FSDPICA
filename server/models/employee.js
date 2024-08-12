module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define("Employee", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        salary: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'category',
                key: 'id',
            }
        }
    }, {
        tableName: 'employee',
        timestamps: false,
    });
    return Employee;
}
