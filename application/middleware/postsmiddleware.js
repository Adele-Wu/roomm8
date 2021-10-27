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
