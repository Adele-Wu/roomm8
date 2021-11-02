/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: postsmiddleware.js
 *
 * Description: This small middleware is to query the database to
 * retrive the top ten most recent posts.
 **************************************************************/
var Post = require("../models/Posts");
const postMiddleWare = {};

postMiddleWare.getRecentPosts = async function (req, res, next) {
  try {
    let results = await Post.getTenMostRecent(10);
    res.locals.results = results;
    if (results.length == 0) {
      console.log("error");
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = postMiddleWare;
