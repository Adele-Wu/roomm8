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
        console.log(res);
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
  let loggedUserId = await User.authenticate(username, password);
  try {
    if (loggedUserId <= 0) {
      throw new UserError(
        "Login failed: User doesn't exist or password doesn't match.",
        "/login",
        200
      );
    }

    req.session.username = username;
    req.session.userId = loggedUserId;
    res.locals.logged = true; // hide things in navbar

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

// router.get("/:id(\\d+)", async (req, res, next) => {
//   let baseSQL = "SELECT * FROM users where user_id = ?;";
//   let [results, fields] = await db.execute(baseSQL, [req.params.id]);
//   // console.log(results);
//   if (results && results.length) {
//     res.render("user-profile", {
//       title: results[0].first_name,
//       currentUser: results[0],
//     });
//   }
// });

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

module.exports = router;
