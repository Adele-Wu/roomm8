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

module.exports = router;
