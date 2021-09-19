const mysql = require("mysql2");
const pool = mysql.createPool({
  // connectionLimit: 50,
  host: "csc648db-aws.crpslpuajdbs.us-east-2.rds.amazonaws.com",
  user: "csc648db_aws",
  password: "asdfasdf",
  database: "csc648db",
});

const promisePool = pool.promise();
module.exports = promisePool;
