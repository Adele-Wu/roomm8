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

/**
 * searchPost and searchUser (boolean) is hardcoded such that we make sure that
 * the search bar is only render in browse room or user. Technically, we can
 * use a unmounted middleware to check for which page we're on.
 */

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Home Page",
    searchPost: false,
    searchUser: false,
  });
});

/**
 * Renders registration page
 */
router.get("/registration", function (req, res, next) {
  res.render("registration", {
    title: "Registration Page",
    searchPost: false,
    searchUser: false,
  });
});

/**
 * Renders login page
 */
router.get("/login", function (req, res, next) {
  res.render("login", {
    title: "Login Page",
    searchPost: false,
    searchUser: false,
  });
});

/**
 * Renders post page (only when a user is logged in)
 */
router.get("/post", function (req, res, next) {
  res.render("postroom", {
    title: "Post Room Page",
    searchPost: false,
    searchUser: false,
  });
});

/**
 * Renders browse room page
 */
router.get("/browse-room", getRecentPosts, function (req, res, next) {
  res.render("browse-room", {
    title: "Browse Room Page",
    searchPost: true,
    searchUser: false,
  });
});

/**
 * Renders browse user page
 */
router.get("/browse-user", getRecentUsers, function (req, res, next) {
  res.render("browse-user", {
    title: "Browse User Page",
    searchPost: false,
    searchUser: true,
  });
});

/**
 * Renders edit page (only when a user is logged in)
 */
router.get("/edit-user", function (req, res, next) {
  res.render("edit-user", {
    title: "Edit Profile",
    searchPost: false,
    searchUser: false,
  });
});

module.exports = router;
