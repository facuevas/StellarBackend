const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");
dotenv.config();

/*
 * Create the connection using sequelize ORM.
 */
const sequelize = new Sequelize(
    "stellar",
    process.env.STELLAR_USERNAME,
    process.env.STELLAR_PASSWORD,
    {
        host: "localhost",
        dialect: "mysql",
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

module.exports = sequelize;