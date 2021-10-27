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
var getRecentPosts = require("../middleware/postsmiddleware").getRecentPosts;
var getRecentUsers = require("../middleware/usersmiddleware").getRecentUsers;
var db = require("../conf/database");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Home Page",
    searchPost: false,
    searchUser: false,
  });
});

router.get("/registration", function (req, res, next) {
  res.render("registration", {
    title: "Registration Page",
    searchPost: false,
    searchUser: false,
  });
});

router.get("/login", function (req, res, next) {
  res.render("login", {
    title: "Login Page",
    searchPost: false,
    searchUser: false,
  });
});

router.get("/post", function (req, res, next) {
  res.render("postroom", {
    title: "Post Room Page",
    searchPost: false,
    searchUser: false,
  });
});

router.get("/browse-room", getRecentPosts, function (req, res, next) {
  res.render("browse-room", {
    title: "Browse Room Page",
    searchPost: true,
    searchUser: false,
  });
});

router.get("/browse-user", getRecentUsers, function (req, res, next) {
  res.render("browse-user", {
    title: "Browse User Page",
    searchPost: false,
    searchUser: true,
  });
});

router.get("/edit-user", function (req, res, next) {
  res.render("edit-user", { title: "Edit User Profile" , searchPost: false,  searchUser: false});
});

module.exports = router;
