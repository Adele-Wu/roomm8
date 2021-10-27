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

var db = require("../conf/database");
var bcrypt = require("bcrypt");
const User = {};

// Base cases to check if username, email, and address is distinct.
User.usernameExists = async (username) => {
  return db
    .execute("SELECT * FROM users where username=?", [username])
    .then(([results, field]) => {
      return !(results && results.length == 0);
    })
    .catch((err) => Promise.reject(err));
};

User.emailExists = async (email) => {
  return db
    .execute("SELECT * FROM users WHERE email=?", [email])
    .then(([results, field]) => {
      return !(results && results.length == 0);
    })
    .catch((err) => Promise.reject(err));
};

User.addressExists = async (address) => {
  return db
    .execute("SELECT * FROM users WHERE address=?", [address])
    .then(([results, field]) => {
      return !(results && results.length == 0);
    })
    .catch((err) => Promise.reject(err));
};

// End of Base cases.

// Once the base cases have been passed, we can then create our new users and encrypt our password
// using bcrypt.hash
// bcrypt.hash takes in a string (password) and the number of 'salt' which generates n number of rounds
// to be used.
User.create = async (
  first_name,
  last_name,
  gender,
  date_of_birth,
  fields,
  schools,
  email,
  username,
  password
) => {
  // npmjs.com/package/bcrypt
  // using technique 2 to auto-gen a salt and hash
  return bcrypt
    .hash(password, 10)
    .then((hashed_password) => {
      // the reason for no checks here is because we have already done so in the base cases.
      let baseSQL =
        "INSERT INTO users (`first_name`, `last_name`, `gender`, `dob`, `fields`,`school`, `email`, `username`, `password`, `usertype`, `created`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())";
      // in the return statement we're passing the hashed_password and not the original!!!
      // TODO
      return db.execute(baseSQL, [
        first_name,
        last_name,
        gender,
        date_of_birth,
        fields,
        schools,
        email,
        username,
        hashed_password,
        1,
      ]);
    })
    .then(([results, fields]) => {
      if (results && results.affectedRows) {
        // results.insertId is the id of the new user and will always be greater than one.
        // insertId is a keyword used for mySql
        console.log(results);
        return results.insertId;
      } else {
        return -1;
      }
    })
    .catch((err) => Promise.reject(err));
};

// create auth method for login below
User.authenticate = async (username, password) => {
  let baseSQL =
    "SELECT user_id, username, password FROM users WHERE username=?;";
  let userId; // <-- don't change to id or it'll mess up with mysql
  return db
    .execute(baseSQL, [username])
    .then(([results, field]) => {
      // here we want a result from our query then have the id persist through once logged in.
      if (results && results.length == 1) {
        userId = results[0].user_id;
        // To learn more about bcrypt, you can go to this link https://github.com/kelektiv/node.bcrypt.js
        // ctrl + f compare
        // we pass in the password and hashed password returning a bool
        return bcrypt.compare(password, results[0].password);
      } else {
        return false;
      }
    })
    .then((passwordsMatched) => {
      if (passwordsMatched) {
        // TODO note that promise resolve and reject is outdated. find new.
        return userId;
      } else {
        return -1;
      }
    })
    .catch((err) => Promise.reject(err));
};

User.getTenMostRecent = async (numberOfPosts) => {
  let baseSQL =
    "SELECT user_id, first_name, last_name, gender, dob, fields, school, email, username, photopath, description FROM users ORDER BY created DESC LIMIT " +
    numberOfPosts +
    ";";
  return db
    .execute(baseSQL, [numberOfPosts])
    .then(([results, fields]) => {
      return results;
    })
    .catch((err) => Promise.reject(err));
};

module.exports = User;
