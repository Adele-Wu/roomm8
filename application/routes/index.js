var express = require("express");
var router = express.Router();
var getRecentPosts = require("../middleware/postsmiddleware").getRecentPosts;
var getRecentUsers = require("../middleware/usersmiddleware").getRecentUsers;
var db = require("../conf/database");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Home Page", searchPost: false });
});

router.get("/registration", function (req, res, next) {
  res.render("registration", { title: "Registration Page", searchPost: false });
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login Page", searchPost: false });
});

router.get("/post", function (req, res, next) {
  res.render("postroom", { title: "Post Room Page", searchPost: false });
});

router.get("/browse-room", getRecentPosts, function (req, res, next) {
  res.render("browse-room", { title: "Browse Room Page", searchPost: true });
});

router.get("/browse-user", getRecentUsers, function (req, res, next) {
  res.render("browse-user", { title: "Browse User Page" });
});

module.exports = router;
