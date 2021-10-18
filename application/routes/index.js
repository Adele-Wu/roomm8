/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: index.js
 *
 * Description: index.js is created to the purpose of handle all the static
 * pages for our web application. These routes lay the foundation for the rest
 * of the other pages necessary for our project.
 **************************************************************/
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

router.get("/edit", function (req, res, next) {
  res.render("edit-profile", {
    title: "Edit Profile",
    searchPost: false,
    searchUser: false,
  });
});

module.exports = router;
