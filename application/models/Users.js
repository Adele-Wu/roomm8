/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: Users.js
 *
 * Description: Users model that handle all of the validation and
 * database queries to mysql.
 **************************************************************/
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
  occupation,
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
        "INSERT INTO users (`first_name`, `last_name`, `gender`, `dob`, `occupation`, `fields`,`school`, `email`, `username`, `password`, `usertype`, `created`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())";
      // in the return statement we're passing the hashed_password and not the original!!!
      // TODO
      return db.execute(baseSQL, [
        first_name,
        last_name,
        gender,
        date_of_birth,
        occupation,
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
    "SELECT user_id, username, password , usertype FROM users WHERE username=? ;";
  let userId; // <-- don't change to id or it'll mess up with mysql
  let usertype;
  return db
    .execute(baseSQL, [username])
    .then(async ([results, field]) => {
      
      // here we want a result from our query then have the id persist through once logged in.
      if (results && results.length == 1) {
        console.log("password");
        userId = results[0].user_id;
        usertype = results[0].usertype;
        // To learn more about bcrypt, you can go to this link https://github.com/kelektiv/node.bcrypt.js
        // ctrl + f compare
        // we pass in the password and hashed password returning a bool
        return await bcrypt.compare(password, results[0].password);
      } else {
        return false;
      }
    })
    .then((passwordsMatched) => {
      if (passwordsMatched) {
        // TODO note that promise resolve and reject is outdated. find new.
        return [userId, usertype];
      } else {
        return -1;
      }
    })
    .catch((err) => Promise.reject(err));
};

User.getTenMostRecent = async (numberOfPosts) => {
  let baseSQL =
    "SELECT user_id, first_name, last_name, gender, dob, occupation, fields, school, email, username, photopath, description FROM users ORDER BY created DESC LIMIT " +
    numberOfPosts +
    ";";
  return db
    .execute(baseSQL, [numberOfPosts])
    .then(([results, fields]) => {
      return results;
    })
    .catch((err) => Promise.reject(err));
};

/**
 * search function that will use a wild card of the searchTerm that will concat the
 * username, first name, last name and occupation to find either any of these that
 * exist within the database.
 *
 * @param {*} searchTerm
 * @returns results of the row results of the search term
 */
User.search = async (searchTerm) => {
  let baseSQL =
    "SELECT user_id, first_name, last_name, gender, dob, occupation, fields, school, email, username, photopath, description, CONCAT(' ', username, first_name, last_name, occupation) AS haystack FROM users HAVING haystack like ?;";
  searchTerm = "%" + searchTerm + "%";
  return await db
    .execute(baseSQL, [searchTerm])
    .then(([results, fields]) => {
      return results;
    })
    .catch((err) => Promise.reject(err));
};

const userCol = [
  "gender",
  "minAgeRange",
  "maxAgeRange",
  "occupation",
  "fields",
  "school",
];
const prefCol = ["pets", "smoking", "lifestyle", "schedule", "language"];
const interestCol = ["interests"];

const partitionObj = (parseObject, column) => {
  return Object.keys(parseObject)
    .filter((k) => column.some((el) => k.includes(el)))
    .reduce((cur, k) => {
      return Object.assign(cur, { [k]: parseObject[k] });
    }, {});
};

/**
 * filter method has two conditions that need to be accounted for.
 * a) when a client selects only within the user table
 * b) or user and either preferences, interest or both are selected.
 * since the user table on its own has a specific query, we can use this
 * our base case. If either preference or interest is selected then
 * we can concat the baseSQL with their respective sql joins using the
 * generalized addFilter() method
 *
 * @param {*} parseObject
 * @param {*} parseObjectKey
 * @returns row results of the selected filter options
 */
User.filter = async (parseObject, parseObjectKey) => {
  let age = false;
  let baseSQL =
    "SELECT DISTINCT u.user_id, u.first_name, u.last_name, u.gender, u.dob, u.occupation, u.fields, u.school, u.email, u.username, u.description, u.photopath FROM users u ";
  let fields = [];
  // bool values to check if they exist in respective tables (user,pref,interest)
  const detectUserCol = userCol.some((r) => parseObjectKey.includes(r));
  const detectPrefCol = prefCol.some((r) => parseObjectKey.includes(r));
  const detectInterestCol = interestCol.some((r) => parseObjectKey.includes(r));

  // separate object to their corresponding tables (user, pref, interest)
  const userObj = partitionObj(parseObject, userCol);
  const prefObj = partitionObj(parseObject, prefCol);
  const interestObj = partitionObj(parseObject, interestCol);

  // special case due to having different query syntax this one must be tailored made
  if (detectUserCol && !detectPrefCol && !detectInterestCol) {
    [baseSQL, fields] = filterUserModularized(
      parseObject,
      baseSQL,
      age,
      fields,
      true
    );
  }

  /**
   * I am using a fizzbuzz approach. Since the join queries are almost identical
   * for preference and interest then either can be included or excluded without
   * affecting the overall baseSQL.
   *
   **/

  // if a pref is detected then concat their join queries
  if (detectPrefCol) {
    [baseSQL, fields] = addFilter(
      userObj,
      prefObj,
      baseSQL,
      age,
      fields,
      "preference",
      detectUserCol
    );
  }
  if (detectInterestCol) {
    [baseSQL, fields] = addFilter(
      userObj,
      interestObj,
      baseSQL,
      age,
      fields,
      "interest",
      detectUserCol
    );
  }
  baseSQL += ";"; // add terminating operator
  return (
    db
      .execute(baseSQL, fields)
      .then(([results, fields]) => {
        return results;
      })
      // note that in the catch you can just return err without Promise.reject() I only do this for clarity purposes when you read my code - E.Y.
      .catch((err) => Promise.reject(err))
  );
};

/**
 * Since the filter for the interest and preference are idenitical except
 * their substitution names (i.e. interest as i or preference as p) we can
 * generalize the query for either and concatenate these to the baseSQL
 * if it's necessary.
 *
 * @param {*} userObj
 * @param {*} interestPrefObj
 * @param {*} baseSQL
 * @param {*} age
 * @param {*} fields
 * @param {*} interestPref
 * @param {*} detectUserCol
 * @returns
 */
let addFilter = (
  userObj,
  interestPrefObj,
  baseSQL,
  age,
  fields,
  interestPref,
  detectUserCol
) => {
  const withS = interestPref + "s";
  const initialChar = interestPref.charAt(0);
  baseSQL += `
    JOIN
      user_${withS} u${initialChar} 
    ON
      u.user_id = u${initialChar}.users_user_id
    JOIN 
      ${withS} ${initialChar} 
    ON
      u${initialChar}.${withS}_${interestPref}_id = ${initialChar}.${interestPref}_id
  `;
  // baseSQL += "JOIN user_" + withS + " u" + initialChar + " ON u.user_id = u" + initialChar + ".users_user_id ";
  // baseSQL += "JOIN " + withS + " " + initialChar + " ON ";
  // baseSQL += "u" + initialChar + "." + withS + "_" + interestPref + "_id = " + initialChar + "." + interestPref + "_id";

  // add user filters, note that you stack for both on statements in mysql queries which will NOT effect the results
  // therefore we can
  if (detectUserCol) {
    baseSQL += " AND";
    [baseSQL, fields] = filterUserModularized(
      userObj,
      baseSQL,
      age,
      fields,
      false
    );
  }
  // since we know that this function is triggered ONLY when a user selects either pref or interest we can always add this.
  baseSQL += " AND " + interestPref + " IN (";

  // add the number of ? need and push to fields array return bSQL and fields
  for (const item in interestPrefObj) {
    if (Array.isArray(interestPrefObj[item])) {
      for (let i = 0; i < interestPrefObj[item].length; i++) {
        baseSQL += "?, ";
        fields.push(interestPrefObj[item][i]);
      }
    } else {
      baseSQL += "?, ";
      fields.push(interestPrefObj[item]);
    }
  }
  baseSQL = baseSQL.substring(0, baseSQL.length - 2);
  baseSQL += ") "; // add closing
  return [baseSQL, fields];
};

const filterUserModularized = (obj, baseSQL, age, fields, flag) => {
  if (flag) baseSQL += `WHERE`;
  for (const column in obj) {
    if (column == "minAgeRange" || column == "maxAgeRange") {
      // we should change this to age++ such that the if statement is age === 2 reason: if front end validation allows only one than it breaks
      age = true;
      continue;
    }
    baseSQL += ` u.${column} = ? AND`;
    fields.push(obj[column]);
  }
  if (age) {
    baseSQL += ` (YEAR(NOW()) - YEAR(u.dob) BETWEEN ${obj[userCol[1]]} AND ${
      obj[userCol[2]]
    }) `;
  } else {
    // trim extra and add semi-colon. MAY NOT NEED TRIM IF PREF OR INTEREST EXIST
    baseSQL = baseSQL.substring(0, baseSQL.length - 4);
    if (flag) baseSQL += ";";
  }
  return [baseSQL, fields];
};




const adminActionChangeEmail = function(new_email,userName)
{
  
  let baseSQL = `UPDATE users SET email = ? WHERE username = ?`;
  db.query(baseSQL, [new_email, userName]);
};
module.exports = User;
