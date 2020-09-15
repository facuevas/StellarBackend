const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: process.env.STELLAR_USERNAME,
    password: process.env.STELLAR_PASSWORD,
    database: 'stellar'
});

pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

process.on("exit", function () {
    console.log("Shutting down.")
    pool.end(function (err) {
        // all connections in the pool have ended
    });
});

module.exports = pool;
