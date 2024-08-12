module.exports = (sequelize, DataTypes) => {
    const Registrations = sequelize.define("Registrations", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM('group', 'individual'),
            allowNull: true,
        },
        participants: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        institution: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        poc_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        poc_contact: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        poc_email: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        special_requirements: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    }, {
        tableName: 'registrations',
        timestamps: false,
    });
    return Registrations;
}

