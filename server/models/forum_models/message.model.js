module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define(
      "Message",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: "Users",
            key: "username",
          },
        },
        Content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        PostedTime: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        UpdateTime: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        NumberOfUpvotes: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        NumberOfDownvotes: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        tableName: "Messages",
        timestamps: false,
      }
    );
  
    Message.associate = (models) => {
      Message.belongsTo(models.Users, {
        foreignKey: "username",
        targetKey: "username", // This specifies that we are linking via the username field
      });
      Message.hasMany(models.EntityTag, {
        foreignKey: "Entity_ID",
      });
    };
  
    return Message;
  };
  