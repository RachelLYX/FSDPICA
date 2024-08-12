'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const db = {};
require('dotenv').config();

// Create sequelize instance using config  
let sequelize = new Sequelize(
    process.env.DB1_NAME, process.env.DB1_USER, process.env.DB1_PWD,
    {
        host: process.env.DB1_HOST,
        port: process.env.DB1_PORT,
        dialect: 'mysql',
        logging: false,
        timezone: '+08:00'
    }
);

let sequelize2 = new Sequelize(
    process.env.DB2_NAME, process.env.DB2_USER, process.env.DB2_PWD,
    {
        host: process.env.DB2_HOST,
        port: process.env.DB2_PORT,
        dialect: 'mysql',
        logging: false,
        timezone: '+08:00'
    }
)

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) &&
            (file.slice(-3) === '.js');
    })
    .forEach(file => {
        try {
            const model = require(path.join(__dirname, file))(sequelize,
                Sequelize.DataTypes);
            db[model.name] = model;
            console.log(`Model ${model.name} loaded successfully.`);
        }
        catch (error) {
            console.error(`Error loading model ${file}:`, error);
        }
    });

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) &&
            (file.slice(-3) === '.js');
    })
    .forEach(file => {
        try {
            const model = require(path.join(__dirname, file))(sequelize2,
                Sequelize.DataTypes);
            db[model.name] = model;
            console.log(`Model ${model.name} loaded successfully.`);
        }
        catch (error) {
            console.error(`Error loading model ${file}:`, error);
        }
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.Program = require("./Volunteering")(sequelize, Sequelize.DataTypes);
db.Program = require("./Programs")(sequelize2, Sequelize.DataTypes);


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 