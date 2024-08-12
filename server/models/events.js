module.exports = (sequelize, DataTypes) => {
    const GroupBookings = sequelize.define("GroupBookings", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        group_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        participants: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        contact_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        contact_email: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        contact_phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        special_requirements: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true,
        },
        event_name: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'rejected'),
            defaultValue: 'pending',
        }
    }, {
        tableName: 'groupbookings',
        timestamps: false,
    });
    return GroupBookings;
}
