module.exports = (sequelize, DataTypes) => {
    const Thread = sequelize.define(
      "Thread",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        rootMessageId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Messages",
            key: "id",
          },
        },
        parentThreadId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "Threads",
            key: "id",
          },
        },
      },
      {
        tableName: "Threads",
        timestamps: false,
      }
    );
  
    Thread.associate = (models) => {
      Thread.belongsTo(models.Forum, {
        foreignKey: "forumId",
        onDelete: "CASCADE",
      });
  
      Thread.belongsTo(models.Message, {
        foreignKey: "rootMessageId",
        as: "RootMessage",
      });
  
      Thread.hasMany(models.Thread, {
        as: "Replies",
        foreignKey: "parentThreadId",
        onDelete: "CASCADE",
      });
  
      Thread.belongsTo(models.Thread, {
        as: "Parent",
        foreignKey: "parentThreadId",
      });
    };
  
    return Thread;
  };
  