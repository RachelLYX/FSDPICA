module.exports = (sequelize, DataTypes) => {
  const Forum = sequelize.define(
    "Forum",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Users",
          key: "username",
        },
      },
      NumberOfUpvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      NumberOfDownvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Forums",
      timestamps: false,
    }
  );

  Forum.associate = (models) => {
    Forum.hasMany(models.Thread, {
      foreignKey: "forumId",
      onDelete: "CASCADE",
    });
  };

  return Forum;
};
