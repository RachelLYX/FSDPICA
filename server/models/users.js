// models/users.js
import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Users = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  school: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  avatar_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('customer', 'employee'),
    defaultValue: 'customer',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

export default Users;
