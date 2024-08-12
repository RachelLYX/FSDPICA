module.exports = (sequelize, DataTypes) => {
    const EntityTag = sequelize.define(
      "EntityTag",
      {
        Entity_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: {
            model: "Messages",
            key: "id",
          },
        },
        Tag_Name: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
      },
      {
        tableName: "EntityTags",
        timestamps: false,
      }
    );
  
    return EntityTag;
  };
  