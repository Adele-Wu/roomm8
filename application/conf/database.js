const mysql = require('mysql2');

// create a pool connection. this will use a sql statement but you have free up the connection afterwards. pool will handle this.
const pool = mysql.createPool({
    connectionLimit: 50,
    host: "localhost",
    user: "root",
    password: "password",
    database: "csc648db",
    connectionLimit: 50,
    debug: false // error from database to see login and password error
});

// don't use the line below as it will not work
// module.exports = pool; 
// this will convert our api to promises based connection objects or non-promised space connection objects
const promisePool = pool.promise();
module.exports = promisePool;
