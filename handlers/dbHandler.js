const mysql = require('mysql');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
dotenv.config();


// const pool = mysql.createPool({
//     connectionLimit: 10,
//     host: 'localhost',
//     user: process.env.STELLAR_USERNAME,
//     password: process.env.STELLAR_PASSWORD,
//     database: 'stellar',
//     port: process.env.STELLAR_DB_PORT,
// });

/*
 * Create the connection using sequelize ORM. 
*/
const sequelize = new Sequelize('stellar', process.env.STELLAR_USERNAME, process.env.STELLAR_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

process.on("exit", function () {
    console.log("Shutting down.")
    pool.end(function (err) {
        // all connections in the pool have ended
    });
});

module.exports = pool;
