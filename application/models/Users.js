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
        // console.log(results);
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

User.search = async (searchTerm) => {
  let baseSQL =
    "SELECT user_id, first_name, last_name, gender, dob, occupation, fields, school, email, username, photopath, description, CONCAT(' ', username) AS haystack FROM users HAVING haystack like ?;";
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
  const userObj = Object.keys(parseObject)
    .filter((k) => userCol.some((el) => k.includes(el)))
    .reduce((cur, k) => {
      return Object.assign(cur, { [k]: parseObject[k] });
    }, {});
  const prefObj = Object.keys(parseObject)
    .filter((k) => prefCol.some((el) => k.includes(el)))
    .reduce((cur, k) => {
      return Object.assign(cur, { [k]: parseObject[k] });
    }, {});
  const interestObj = Object.keys(parseObject)
    .filter((k) => interestCol.some((el) => k.includes(el)))
    .reduce((cur, k) => {
      return Object.assign(cur, { [k]: parseObject[k] });
    }, {});

  // special case due to having different query syntax this one must be tailored made
  // this is done!!!!!!!!
  if (detectUserCol && !detectPrefCol && !detectInterestCol) {
    [baseSQL, fields] = filterUser(parseObject, baseSQL, age, fields);
  }

  // TODO: fix pref and interest (fizzbuzz) try to split object based on pref and interest
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
  // return "";
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

let addFilter = (
  userObj,
  interestProfObj,
  baseSQL,
  age,
  fields,
  interestPref,
  detectUserCol
) => {
  // TODO: interest and pref need their own abbr for when you join user_preferences and user_interests
  const withS = interestPref + "s";
  const initialChar = interestPref.charAt(0);
  // only doing this cause prettier does some weird shit
  baseSQL +=
    "JOIN user_" +
    withS +
    " u" +
    initialChar +
    " ON u.user_id = u" +
    initialChar +
    ".users_user_id ";
  baseSQL += "JOIN " + withS + " " + initialChar + " ON ";
  baseSQL +=
    "u" +
    initialChar +
    "." +
    withS +
    "_" +
    interestPref +
    "_id = " +
    initialChar +
    "." +
    interestPref +
    "_id";

  console.log(baseSQL);

  // add user filters, note that you stack for both on statements in mysql queries which will NOT effect the results
  // therefore we can
  if (detectUserCol) {
    baseSQL += " AND";
    [baseSQL, fields] = filterUserWithAnd(userObj, baseSQL, age, fields);
  }
  // since we know that this function is triggered ONLY when a user selects either pref or interest we can always add this.
  baseSQL += " AND " + interestPref + " IN (";

  // add the number of ? need and push to fields array return bSQL and fields
  for (const item in interestProfObj) {
    if (Array.isArray(interestProfObj[item])) {
      for (let i = 0; i < interestProfObj[item].length; i++) {
        baseSQL += "?, ";
        fields.push(interestProfObj[item][i]);
      }
      // bug is here need conditonal state but which conditional statement
    } else {
      baseSQL += "?, ";
      fields.push(interestProfObj[item]);
    }
  }

  // doesn't matter what scenario that you have if it's list, str, str, str, list OR str, str, list, OR list, str OR list, str, str, OR str, str, str, list.
  // the only thing we need to remove is the trailing comma AT THE END, STUPID MFER GOD so much time wasted overthinking this..
  baseSQL = baseSQL.substring(0, baseSQL.length - 2);

  baseSQL += ") "; // add closing
  return [baseSQL, fields];
};

const filterUserWithAnd = (userObj, baseSQL, age, fields) => {
  for (const column in userObj) {
    if (column == "minAgeRange" || column == "maxAgeRange") {
      // we should change this to age++ such that the if statement is age === 2 reason: if front end validation allows only one than it breaks
      age = true;
      continue;
    }
    baseSQL += ` u.${column} = ? AND`;
    fields.push(userObj[column]);
  }
  if (age) {
    baseSQL += ` (YEAR(NOW()) - YEAR(u.dob) BETWEEN ${
      userObj[userCol[1]]
    } AND ${userObj[userCol[2]]}) `;
  } else {
    // trim extra and add semi-colon. MAY NOT NEED TRIM IF PREF OR INTEREST EXIST
    baseSQL = baseSQL.substring(0, baseSQL.length - 4);
  }
  return [baseSQL, fields];
};

// atomity function to filter when a user preference in the user table is to be filtered.
const filterUser = (parseObject, baseSQL, age, fields) => {
  baseSQL += `WHERE`;
  for (const column in parseObject) {
    if (column == "minAgeRange" || column == "maxAgeRange") {
      // we should change this to age++ such that the if statement is age === 2 reason: if front end validation allows only one than it breaks
      age = true;
      continue;
    }
    baseSQL += ` u.${column} = ? AND`;
    fields.push(parseObject[column]);
  }
  if (age) {
    baseSQL += ` (YEAR(NOW()) - YEAR(u.dob) BETWEEN ${
      parseObject[userCol[1]]
    } AND ${parseObject[userCol[2]]});`;
  } else {
    // trim extra and add semi-colon.
    baseSQL = baseSQL.substring(0, baseSQL.length - 4);
    baseSQL += `;`;
  }
  return [baseSQL, fields];
};

module.exports = User;
