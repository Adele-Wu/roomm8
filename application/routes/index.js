var express = require("express");
var router = express.Router();
var getRecentPosts = require("../middleware/postsmiddleware").getRecentPosts;
var db = require("../conf/database");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Home Page", search: false });
});

router.get("/registration", function (req, res, next) {
  res.render("registration", { title: "Registration Page", search: false });
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login Page", search: false });
});

router.get("/post", function (req, res, next) {
  res.render("postroom", { title: "Post Room Page", search: false });
});

router.get("/browse-room", getRecentPosts, function (req, res, next) {
  res.render("browse-room", { title: "Browse Room Page", search: true });
});

router.get("/browse-user", function (req, res, next) {
  res.render("browse-user", { title: "Browse User Page" });
});

module.exports = router;
