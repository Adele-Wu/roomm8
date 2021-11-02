/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: database.js
 *
 * Description: database.js is used to create our connection to MySQL.
 **************************************************************/
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
