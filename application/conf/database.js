/* ============================================================================================

  * Project: ROOMM8 (Room and Roommate Finder for College Students & Professionals)
  * Class: CSC-648-02 Software Engineering Final Project 
  * Fall 2021
  * TEAM 5 MEMBERS
    > Edward Yun, 
    > Jeffrey Fullmer Gradner, 
    > Adele Wu, 
    > Jeff Friedrich,
    > Kris Byington, 
    > Jose Quinteros
  
  * File: about_me.hbs
  * Description: contains...
  
  ================================================================================================= */

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
