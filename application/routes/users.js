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

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

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

    // then promises method.
    // User.usernameExists(username)
    // .then((usernameDoesExist) => {
    //   if(usernameDoesExist) {
    //     throw new UserError(
    //       "Registration Failed: Username already exist",
    //       "/registration",
    //       200
    //     );
    //   } else {
    //     return User.emailExists(email);
    //   }
    // })
    // .then((emailDoesExist) => {
    //   if(emailDoesExist) {
    //     throw new UserError(
    //       "Registration Failed: Email already exist",
    //       "/registration",
    //       200
    //     )
    //   } else {
    //       return User.create(first_name, last_name, address, email, username, password);
    //   }
    // })
    // .then((createdUserId) => {
    //   if(createdUserId < 0) {
    //     throw new UserError(
    //       "Server Error, user could not be created",
    //       "/registration",
    //       500
    //     );
    //   } else {
    //     successPrint("Registration Success: User was created!");
    //     // req.flash will only work with sessions until such time leave these commented until sessions are done.
    //     // req.flash('success', 'User account has been made!');
    //     res.redirect("/login");
    //   }
    // })
    // .catch((err) => {
    //   errorPrint("User couldn't be made", err);
    //   if (err instanceof UserError) {
    //     // print to console
    //     errorPrint(err.getMessage());
    //     // flash on browser
    //     // req.flash('error', err.getMessage());
    //     res.status(err.getStatus());
    //     res.redirect(err.getRedirectURL());
    //   } else {
    //     next(err);
    //   }
    // });
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  
  userInfo= await User.authenticate(username, password);
  const loggedUserId =userInfo[0];
  let usertype = userInfo[1];

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

  // then promise method
  // User.authenticate(username, password)
  // .then((loggedUserId) => {
  //   if(loggedUserId > 0){
  //     successPrint(`User ${username} was able to log in.`);
  //     req.session.username = username;
  //     req.session.userId = loggedUserId;
  //     res.locals.logged = true;
  //     req.flash('success', 'You are logged in.');
  //     console.log("am i getting to this line");
  //     res.redirect('/');
  //   } else {
  //     throw new UserError(
  //       "Invalid username or password",
  //       "/login",
  //       200
  //     )
  //   }
  // })
  // .catch((err) => {
  //   if(err instanceof UserError){
  //     errorPrint(err.getMessage());
  //     req.flash('error', err.getMessage());
  //     res.status(err.getStatus());
  //     res.redirect("/login");
  //   } else {
  //     next(err);
  //   }
  // })
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

// purely here to test if the db is connect
// manually type or copypasta url below to test db
// localhost:3000/users/getUsers
// look in console to see if the data is being re
// router.get('/getUsers', (req, res, next) => {
//   let baseSQL = "SELECT * FROM users";
//   db.execute(baseSQL).then(([results, fields]) => {
//     if(results && results.length == 0){
//       console.log('error');
//       // res.render(results);
//     }
//     else{
//       console.log(results);
//       // res.render(results);  
//     }
//   })
// })

router.get("/admin-panel", function (req, res, next) {
  res.render("admin-panel", {
    title: "Admin Panel",
    searchPost: false,
    searchUser: true,
  });
});

router.post("/AdminAction",async function(request,response,next)
{
  const { admin_username, admin_password } = request.body;
  let loggedUserId = await User.authenticate(admin_username, admin_password);
  try 
  {
    if (loggedUserId <= 0) 
    {
      throw new UserError(
        "Login failed: User doesn't exist or password doesn't match.","/login",200);
      }
    }
  catch (err) 
  {
    if (err instanceof UserError) 
    {
        errorPrint(err.getMessage());
        // flash on browser | will not work without session
        req.flash("error", err.getMessage());
        res.status(err.getStatus());
        res.redirect("/login");
    } 
    else 
    {
        next(err);
    }
  }

  let userName= request.body.username;
  switch(request.body.operation_selector)
  {
    case "change-email":
    {
      let new_email= request.body.new_email;
      let baseSQL = `UPDATE users SET email = ? WHERE username = ?`;
      db.query(baseSQL,[new_email,userName]);
      response.redirect("/users/admin-panel")
      break;
    }
    case "delete-user":
    {
      let baseSQL=`DELETE FROM users WHERE username = '${userName}'`;
      db.execute(baseSQL);
      response.redirect("/");
      break;
    }
    case "change-password":
    {
      let new_password= request.body.password;
      let hashed_password = bcrypt.hash(password, 10);
      let baseSQL = `UPDATE users SET password = ${hashed_password} WHERE username = ${userName}`
      db.execute(baseSQL);
      next;
      break;
    }
    case "match-user":
      {

      }
  }
});

router.get("/getUserName/:email",async function(request,response,next)
{
  let baseSQL = `SELECT U.username FROM users U WHERE U.email = ?`;
  console.log(request.params.email)
  db.execute(baseSQL,[request.params.email]).then(function([results,fields])
  {
        console.log(results)
        response.json(results);
    });
  });

router.get("/getEmail/:username",async function(request,response,next)
{
  let baseSQL = `SELECT U.email FROM users U WHERE U.username = ?`
  db.execute(baseSQL,[request.params.username]).then(function([results,fields])
  {
        console.log(results)
        response.json(results);
    });
});

router.post("/edit-user", async (req, res, next) => {
  res.redirect("/");
  //dummy redirect, needs DB logic per case from Delete_this
});


module.exports = router;
