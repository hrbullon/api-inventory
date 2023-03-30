require('dotenv').config();

const { Sequelize } = require('sequelize');

const { DB_DATABASE, DB_USER, DB_PASS, DB_HOSTNAME } = process.env

const sequelize = new Sequelize(DB_DATABASE,DB_USER, DB_PASS,{
    host: DB_HOSTNAME,
    dialect:'mysql'
})

try {
    sequelize.authenticate().then( () => {
        
        console.log("Database connection susscesful!")
    })
} catch (error) {
    console.log("Error database connection")
} 

module.exports = sequelize