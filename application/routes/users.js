/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: users.js
 *
 * Description: users router that will handle all user routes that will
 * check and validate all incoming user inputs and then send to the
 * Users Model.
 **************************************************************/
var express = require("express");
var router = express.Router();
var db = require("../conf/database");
const User = require("../models/Users");
const UserError = require("../helpers/error/UserError");
const { successPrint, errorPrint } = require("../helpers/debug/debugprinters");
var bcrypt = require("bcrypt");
var flash = require("express-flash");
var { body, validationResult } = require("express-validator");
const session = require("express-session");
const { sessionSave, delay } = require("../utils/promisification");
require("dotenv").config();
let aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-2" ,accessKeyId:process.env.AWS_ACCESS_KEY_ID ,
secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY});


/**
 * /register calls body("email").isEmail() from the express-validator library to
 * validate/sanitize the client's email. express-validator also has many different
 * methods such as .trim(), .normalizeEamil(), .bail(), .exists() that can be chained
 * within the array, however, for simplicity, I only went with isEmail().
 * With the User Model, we have simple checks to see if a username and email exist
 * within the database such that there are no duplicates. If any of these were to trigger
 * then we would reroute them back to the registration page and inform them that
 * the username and email is taken.
 */
router.post("/register", [body("email").isEmail()], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.redirect("/");
  } else {
    // const { first_name, last_name, address, email, username, password, confirm_password } = req.body;
    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      occupation,
      fields,
      schools,
      email,
      username,
      password,
      confirm_password,
    } = req.body;

    try {
      if (await User.usernameExists(username)) {
        throw new UserError(
          "Registration Failed: Username already exist",
          "/registration",
          200
        );
      }
      if (await User.emailExists(email)) {
        throw new UserError(
          "Registration Failed: Email already exist",
          "/registration",
          200
        );
      }
      // if(await User.addressExists(address)){
      //   throw new UserError(
      //     "Registration Failed: Address already exist",
      //     "/registration",
      //     200
      //   );
      // }
      if (
        (await User.create(
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
        )) < 0
      ) {
        throw new UserError(
          "Server Error: User failed to be created.",
          "/registration",
          500
        );
      }
      // else print you gucci and redirect to login
      successPrint("Registration Success: User was created!");
      req.session.save((err) => {
        res.redirect("/login");
      });

      // res.redirect("/login");
    } catch (err) {
      if (err instanceof UserError) {
        errorPrint("User couldn't be made", err);
        errorPrint(err.getMessage());
        // flash on browser | will not work without session
        req.flash("error", err.getMessage());
        // res.status(err.getStatus());
        res.redirect(err.getRedirectURL());
      } else {
        next(err);
      }
    }
  }
});

/**
 * /login would only need to authenticate the username and password, in order,
 * to validate the client's username and password.
 *
 * req.session is persistent throughout the application with a cookie that has a
 * specific time (once it exceeds it's duration then it will be destroyed.)
 *
 * Within, the promisification.js file, we pass in the session object to return a
 * promise. This is to ensure that the session actually stores the value of
 * req.session.username = username
 * req.session.userId = loggedUserId
 * res.locals.logged = true
 * before redirecting to the next page. This must happen such that the logged boolean
 * is set for handlebars to render the correct navbars. We can use the delay method,
 * however, there is a major flaw to this method. As we begin to abuse this method, the
 * time that it takes to render new pages would increase causing more delays which would
 * most likely lose many clients due to impatiences. (i.e. don't use it cause it'll cause
 * lag throughout the application)
 */
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  userInfo = await User.authenticate(username, password);
  let loggedUserId = userInfo[0];
  let usertype = userInfo[1];
  try {
    if (!loggedUserId) {
      throw new UserError(
        "Login failed: User doesn't exist or password doesn't match.",
        "/login",
        200
      );
    }
    req.session.username = username;
    req.session.userId = loggedUserId;
    res.locals.logged = true; // hide things in navbar
    req.session.usertype = usertype;
    successPrint(`${username} is logged in.`);
    // whenever you're storing sessions
    // req.session.save((err) => {
    //   res.redirect("/");
    // });

    // look up promisify for utils
    await sessionSave(req.session);
    res.redirect("/");
    // await promiseSave(req);
    // res.redirect("/");
  } catch (err) {
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      // flash on browser | will not work without session
      req.flash("error", err.getMessage());
      res.status(err.getStatus());
      res.redirect("/login");
    } else {
      next(err);
    }
  }
});

/**
 * /logout work in tandem with a frontend javascript script that fetchs this
 * route in order to destroy our session of our current client.
 */
router.post("/logout", async (req, res, next) => {
  await req.session.destroy((err) => {
    if (err) {
      errorPrint("Session could not be destroyed.");
      next(err);
    } else {
      successPrint("Session is destroyed.");
      res.end();
      res.clearCookie("this is my special key");
      res.json({ status: "OK", message: "User is logged out." });
    }
  });
});

router.get("/:id(\\d+)", async (req, res, next) => {
  let baseSQL = "SELECT * FROM users where user_id = ?;";
  let [results, fields] = await db.execute(baseSQL, [req.params.id]);
  // console.log(results);
  if (results && results.length) {
    res.render("user-profile", {
      title: results[0].first_name,
      currentUser: results[0],
    });
  }
});

/**
 * /search will search by a user text input with a few conditions
 * a) if no input is given and trigger then return nothing
 * b) else return results of the search term
 * b.1) if it finds n results return results
 * b.2) else call the top ten most recent results in the database.
 */
router.get("/search", async (req, res, next) => {
  try {
    let searchTerm = req.query.search;
    if (!searchTerm) {
      res.send({
        results: [],
      });
    } else {
      let results = await User.search(searchTerm);
      if (results.length) {
        res.send({
          results: results,
        });
      } else {
        let results = await User.getTenMostRecent(10);
        res.send({
          results: results,
        });
      }
    }
  } catch (err) {
    next(err);
  }
});

/**
 * /filter will filter the user preferences, interests, and user table
 */
router.get("/filter", async (req, res, next) => {
  let parseObject = Object.fromEntries(
    Object.entries(req.query).filter(([_, v]) => v != "")
  );
  // uncomment this and make sure we get an empty object and shows nothing when the filter is given nothing.
  if (Object.keys(parseObject).length === 0) {
    res.render("browse-user");
  } else {
    let results = await User.filter(parseObject, Object.keys(parseObject));
    res.render("browse-user", {
      results: results,
    });
  }
});


router.get("/admin-panel", function (req, res, next) 
{
  res.render("admin-panel", {
    title: "Admin Panel",
    searchPost: false,
    searchUser: true,
  });
});

router.post("/AdminAction", async function (request, response, next) {
  const { admin_username, admin_password } = request.body;
  let loggedUserId = await User.authenticate(admin_username, admin_password);
  try {
    if (loggedUserId <= 0) {
      throw new UserError(
        "Login failed: User doesn't exist or password doesn't match.",
        "/login",
        200
      );
    }
  } catch (err) {
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      // flash on browser | will not work without session
      req.flash("error", err.getMessage());
      res.status(err.getStatus());
      res.redirect("/login");
    } else {
      next(err);
    }
  }

  let userName = request.body.username;
  switch (request.body.operation_selector) {
    case "change-email": {
      let new_email = request.body.new_email;
      Users.adminActionChangeEmail(new_email,userName);
      response.redirect("/users/admin-panel");
      break;
    }
    case "delete-user": {
      let baseSQL = `DELETE FROM users WHERE username = '${userName}'`;
      db.execute(baseSQL);
      response.redirect("/");
      break;
    }
    case "change-password":
    {
      let new_password= request.body.new_password;
      console.log(new_password)
      bcrypt.hash(new_password, 10).then(function(hashed_password)
      {
        let baseSQL = `UPDATE users SET password = '${hashed_password}' WHERE username = '${userName}'`
        console.log(baseSQL);
        db.execute(baseSQL);
      });
      
      response.redirect("/users/admin-panal");
      break;
    }
    case "match-user":
      {
        let userName2 = request.body.username2;
        let baseSQL = `select email from users where username = "${userName}"; `
        let baseSQL2 = `select email from users where username = "${userName2}"; `
        let email = await db.query(baseSQL);
        let email2 = await db.query(baseSQL2);
        sesTest(email, "messageCurrior@roomm8.net", `Hey ${userName} you have been matched with ${userName2}`, `${userName}`);
        sesTest(email2, "messageCurrior@roomm8.net", `Hey ${userName2} you have been matched with ${userName}`, `${userName2}`);
      }
    case "change-user-type":
    {
      let new_user_type = request.body.new_user_type;
      let userTypeIntValue=1;
      if(new_user_type=="user")
      {
        userTypeIntValue=1;
      }
      if(new_user_type=="admin")
      {
        userTypeIntValue=0;
      }
        let baseSQL = `UPDATE users SET usertype = ${userTypeIntValue} WHERE username = '${userName}'`
        db.execute(baseSQL);
        console.log(new_user_type);
        response.redirect("/users/admin-panel")
        break;
    }
  }
});

router.get("/getUserName/:email", async function (request, response, next) {
  let baseSQL = `SELECT U.username FROM users U WHERE U.email = ?`;
  console.log(request.params.email);
  db.execute(baseSQL, [request.params.email]).then(function ([
    results,
    fields,
  ]) {
    console.log(results);
    response.json(results);
  });
});

router.get("/getEmail/:username", async function (request, response, next) {
  let baseSQL = `SELECT U.email FROM users U WHERE U.username = ?`;
  db.execute(baseSQL, [request.params.username]).then(function ([
    results,
    fields,
  ]) {
    console.log(results);
    response.json(results);
  });
});

  router.post("/edit-user", async (req, res, next) => {
    //do I need db.execute or db.query 
    //imperitvie that the query is in an array in the order sql will fill in that statements 
    console.log(req.session);
    console.log(req.body);
    const sessionsUsername = req.session.username;
    const updateItem = req.body.update_this;
    
    //lines 105 through 128 in Users in the authenticate function 
    //they have the .then promise chain flow you need to catch errors correctly 

    if(updateItem == 'delete'){
      let baseSQL = `DELETE FROM users WHERE username = '${sessionsUsername}'`;
      db.execute(baseSQL)
      .then(async ([results, field]) => {
        console.log(sessionsUsername + " is deleted");
      })
      .catch((err) => Promise.reject(err));;
      res.redirect("/");
    }

    if(updateItem == 'first_name'){
      let new_first_name = req.body.first_name;
      let baseSQL = `UPDATE users SET first_name = ? WHERE username = ?`;
      return db
      .query(baseSQL,[new_first_name,sessionsUsername])
      .then(async ([results, field]) => {
        // if(results && results.length == 1){
        //   console.log(updateItem + " changed succesfully");
        // }
        console.log(updateItem + " changed succesfully");
        res.redirect( sessionsUsername);
        //res.render("user/" + sessionsUsername);
      }).catch((err) => Promise.reject(err));
    }

    if(updateItem == 'last_name'){
      let new_last_name = req.body.last_name;
      let baseSQL = `UPDATE users SET last_name = ? WHERE username = ?`;
      return db
      .query(baseSQL,[new_last_name,sessionsUsername])
      .then(async ([results, field]) => {
        // if(results && results.length == 1){
        //   console.log(updateItem + " changed succesfully");
        // }
        console.log(updateItem + " changed succesfully");
        res.redirect(sessionsUsername);
      }).catch((err) => Promise.reject(err));
    }

    if(updateItem == 'gender'){
      let new_gender = req.body.gender;
      let baseSQL = `UPDATE users SET gender = ? WHERE username = ?`;
      //db.query(baseSQL,[new_gender,sessionsUsername]);
      return db
      .query(baseSQL,[new_gender,sessionsUsername])
      .then(async ([results, field]) => {
        // if(results && results.length == 1){
        //   console.log(updateItem + " changed succesfully");
        // }
        console.log(updateItem + " changed succesfully");
        res.redirect(sessionsUsername);
      }).catch((err) => Promise.reject(err));
    }

    if(updateItem == 'birth_date'){
      let new_birth_date = req.body.date_of_birth;
      let baseSQL = `UPDATE users SET dob = ? WHERE username = ?`;
      return db
      .query(baseSQL,[new_birth_date,sessionsUsername])
      .then(async ([results, field]) => {
        // if(results && results.length == 1){
        //   console.log(updateItem + " changed succesfully");
        // }
        console.log(updateItem + " changed succesfully");
        res.redirect(sessionsUsername);
      }).catch((err) => Promise.reject(err));
    }

    if(updateItem == 'field'){
      let new_fields = req.body.fields;
      let baseSQL = `UPDATE users SET fields = ? WHERE username = ?`;
      //db.query(baseSQL,[new_fields,sessionsUsername]); 
      return db
      .query(baseSQL,[new_fields,sessionsUsername])
      .then(async ([results, field]) => {
        console.log(updateItem + " changed succesfully");
        res.redirect(sessionsUsername);
      }).catch((err) => Promise.reject(err));
    }

    if(updateItem == 'school'){
      let new_schools = req.body.schools;
      let baseSQL = `UPDATE users SET school = ? WHERE username = ?`;
      //db.query(baseSQL,[new_schools,sessionsUsername]);
      return db
      .query(baseSQL,[new_schools,sessionsUsername])
      .then(async ([results, field]) => {
        // if(results && results.length == 1){
        //   console.log(updateItem + " changed succesfully");
        // }
        console.log(updateItem + " changed succesfully");
        res.redirect(sessionsUsername);
      }).catch((err) => Promise.reject(err));
    }

    if(updateItem == 'email' ){
      try{
        if (await User.emailExists(req.body.username)) {
          throw new UserError(
            "update Failed: Email already exist",
            "/",
            200
          );
        }
      }catch (err) {
        if (err instanceof UserError) {
          errorPrint(err.getMessage());
          req.flash("error", err.getMessage());
          res.redirect(err.getRedirectURL());
        } else {
          next(err);
        }
      }
      let new_email = req.body.email;
      let baseSQL = `UPDATE users SET email = ? WHERE username = ?`;
      //db.query(baseSQL,[new_email,sessionsUsername]);
      return db
      .query(baseSQL,[new_email,sessionsUsername])
      .then(async ([results, field]) => {
        // if(results && results.length == 1){
        //   console.log(updateItem + " changed succesfully");
        // }
        console.log(updateItem + " changed succesfully");
        res.redirect(sessionsUsername);
      }).catch((err) => Promise.reject(err));
    }

    if(updateItem == 'username'){
      try {
        if (await User.usernameExists(sessionsUsername)) {
          throw new UserError(
            "update Failed: Username already exist",
            "/",
            200
          );
        }
      }catch (err) {
        if (err instanceof UserError) {
          errorPrint("User couldn't be made", err);
          errorPrint(err.getMessage());
          req.flash("error", err.getMessage());
          res.redirect(err.getRedirectURL());
        } else {
          next(err);
        }
      }
      let new_username = req.body.username;
      let baseSQL = `UPDATE users SET username = ? WHERE username = ?`;
      let results = await db.query(baseSQL, [new_username, sessionsUsername]);
      console.log(results);
      if(results && results.length){
      //req.session.username = new_username; 
      //await sessionSave(req.session);//does not update the session
      res.redirect(new_username);
    }
     
      // return db
      // .query(baseSQL,[new_username,sessionsUsername])
      // .then(async ([results, field]) => {
      //   // if(results && results.length == 1){
      //   //   console.log(updateItem + " changed succesfully");
      //   // }
      //   console.log(updateItem + " changed succesfully");
      //   res.redirect(new_username);
      // }).catch((err) => Promise.reject(err));
    }

    if(updateItem =='password' && req.body.password == req.body.confirm_password){
      let new_password= req.body.password;
      let hashed_password = bcrypt.hash(password, 10);
      let baseSQL = `UPDATE users SET password = ? WHERE username = ?`;
      //db.execute(baseSQL,[hashed_password,sessionsUsername]);
      return db
      .query(baseSQL,[hashed_password,sessionsUsername])
      .then(async ([results, field]) => {
        // if(results && results.length == 1){
        //   console.log(updateItem + " changed succesfully");
        // }
        console.log(updateItem + " changed succesfully");
        res.redirect(sessionsUsername);
      }).catch((err) => Promise.reject(err));
      next;
    }
    //dummy redirect, needs DB logic per case from Delete_this
    res.redirect('/edit-user');
  });

// Interesting bug. Looks like /:params has priority over /filter, therefore it's necessary to have this
// route after
router.get("/:username", async (req, res, next) => {
  try {
    // check if username exist within database. if it's not then redirect back
    if (!(await User.usernameExists(req.params.username))) {
      throw new UserError(
        "Username: The username you're looking for doesn't exist.",
        "/browse-user",
        200
      );
    }
    let baseSQL = "SELECT * FROM users where username = ?;";
    let [results, fields] = await db.execute(baseSQL, [req.params.username]);
    if (results && results.length) {
      res.render("user-profile", {
        title: results[0].first_name,
        currentUser: results[0],
      });
    }
  } catch (err) {
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      res.status(err.getStatus());
      res.redirect("/browse-user");
    } else {
      next(err);
    }
  }
});
router.post("/sendMessage", async function (request, response, next) {
  let usersEmail = request.body.usersEmail;
  let userName = request.body.userName;
  let message = request.body.message;
  
  sesTest(usersEmail,"messageCurrior@roomm8.net",message,userName);
  //mailer.sendEmail(usersEmail, userName, message);
  response.json({ response: "message sent" });
});
function sesTest(emailTo, emailFrom, message, name) {




  var params = {
    Destination: {
      ToAddresses: [emailTo]
    },
    Message: {
      Body: {
        Text: { Data: "From Contact Form: " + name + "\n " + message }
      },

      Subject: { Data: "From: " + emailFrom }
    },
    Source: "messageCurrior@roomm8.net"
  };
  


  return ses.sendEmail(params).promise().then(function(sucess)
  {
      console.log(sucess);
  }).catch(function(error)
  {
      console.log(error);
  });
}
module.exports = router;
