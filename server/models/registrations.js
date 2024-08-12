import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import Events from './events.js'; // Assuming you have an Events model

const Registrations = sequelize.define('Registrations', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Events,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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
    type: DataTypes.STRING,
    allowNull: true,
  },
  poc_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  poc_contact: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  poc_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  special_requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'registrations',
  timestamps: false,
});

export default Registrations;
