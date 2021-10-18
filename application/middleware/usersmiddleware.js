/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: usersmiddleware.js
 *
 * Description: This small middleware is used to be called whenever the
 * browse-user.hbs is render the top recent users that were registered
 * to our application.
 **************************************************************/
var User = require("../models/Users");
const usersMiddleWare = {};

usersMiddleWare.getRecentUsers = async function (req, res, next) {
  try {
    let results = await User.getTenMostRecent(10);
    res.locals.results = results;
    if (results.length == 0) {
      console.log("error");
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = usersMiddleWare;
