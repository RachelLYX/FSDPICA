'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

const basename = path.basename(__filename);
const db = {};
const db2 = {};

// Create Sequelize instances using configurations
const sequelize = new Sequelize(
    process.env.DB1_NAME, process.env.DB1_USER, process.env.DB1_PWD,
    {
        host: process.env.DB1_HOST,
        port: process.env.DB1_PORT,
        dialect: 'mysql',
        logging: false,
        timezone: '+08:00'
    }
);

const sequelize2 = new Sequelize(
    process.env.DB2_NAME, process.env.DB2_USER, process.env.DB2_PWD,
    {
        host: process.env.DB2_HOST,
        port: process.env.DB2_PORT,
        dialect: 'mysql',
        logging: false,
        timezone: '+08:00'
    }
);

// Function to load models into a database object
function loadModels(sequelizeInstance, dbObject) {
    fs
        .readdirSync(__dirname)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) &&
                (file.slice(-3) === '.js');
        })
        .forEach(file => {
            try {
                const model = require(path.join(__dirname, file))(sequelizeInstance, Sequelize.DataTypes);
                dbObject[model.name] = model;
                console.log(`Model ${model.name} loaded successfully.`);
            } catch (error) {
                console.error(`Error loading model ${file}:`, error);
            }
        });
}

// Load models for both databases
loadModels(sequelize, db);
loadModels(sequelize2, db2);

// Manually add specific models
db.Program = require("./Volunteering")(sequelize, Sequelize.DataTypes);
db.Program2 = require("./Programs")(sequelize2, Sequelize.DataTypes);

db.ChatMessage = require("./chat.message.model")(sequelize, Sequelize.DataTypes);
db.Forum = require('./forum_models/forum.model')(sequelize, Sequelize.DataTypes);
db.Thread = require('./forum_models/thread.model')(sequelize, Sequelize.DataTypes);
db.Message = require('./forum_models/message.model')(sequelize, Sequelize.DataTypes);
db.EntityTag = require('./forum_models/entity.tag.model')(sequelize, Sequelize.DataTypes);

// Set up associations for both database objects
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

Object.keys(db2).forEach(modelName => {
    if (db2[modelName].associate) {
        db2[modelName].associate(db2);
    }
});

// Add Sequelize instances to the respective database objects
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db2.sequelize = sequelize2;
db2.Sequelize = Sequelize;

// module.exports = {
//     ...db,  // default export
//     db,
//     db2,
// };

module.exports = db;
