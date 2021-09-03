var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const User = require('../models/Users');
const UserError = require('../helpers/error/UserError');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
var bcrypt = require('bcrypt');
var flash = require('express-flash');
var { body, validationResult } = require('express-validator');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/register', [body("email").isEmail()], async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.redirect("/");
  } else {
    const { first_name, last_name, address, email, username, password, confirm_password } = req.body;
    
    try{
      if(await User.usernameExists(username)){
        throw new UserError(
          "Registration Failed: Username already exist",
          "/registration",
          200
        );
      }
      if(await User.emailExists(email)){
        throw new UserError(
          "Registration Failed: Email already exist",
          "/registration",
          200
        );
      }
      if(await User.addressExists(address)){
        throw new UserError(
          "Registration Failed: Address already exist",
          "/registration",
          200
        );
      }
      if(await User.create(first_name, last_name, address, email, username, password) < 0) {
        throw new UserError(
          "Server Error: User failed to be created.",
          "/registration",
          500
        );
      }
      // else print you gucci and redirect to login
      successPrint("Registration Success: User was created!");
      res.redirect("/login");
    } catch(err){
      errorPrint("User couldn't be made", err);
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        // flash on browser | will not work without session
        req.flash('error', err.getMessage());
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

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;  

  // we can go for either a try catch block with async 
  // let loginUserId;
  // try{
  //   if(await (loginUserId = User.authenticate(username, password))){
  //     console.log(loginUserId);
  //     throw new UserError(
  //       "Server Failed: User doesn't exist",
  //       "/login",
  //       200
  //     );
  //   }
  //   console.log(loginUserId);
  //   // res.session.username = username;
  //   // res.session.userId = results

  //   res.redirect('/login');
  // } catch(err) {
  //   if(err instanceof UserError){
  //     console.log('errrrr');
  //     errorPrint(err.getMessage);
  //     res.status(err.getStatus());
  //     res.redirect('/login');
  //   } else {
  //     next(err);
  //   }
  // }

  // then promise method
  User.authenticate(username, password)
  .then((loggedUserId) => {
    if(loggedUserId > 0){
      successPrint(`User ${username} was able to log in.`);
      req.session.username = username;
      req.session.userId = loggedUserId;
      res.locals.logged = true;
      req.flash('success', 'You are logged in.');
      console.log("am i getting to this line");
      res.redirect('/');
    } else {
      throw new UserError(
        "Invalid username or password",
        "/login",
        200
      )
    }
  })
  .catch((err) => {
    if(err instanceof UserError){
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus);
      res.redirect("/login");
    } else {
      next(err);
    }
  })
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

module.exports = router;