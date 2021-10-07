var express = require("express");
var getRecentPosts = require("../middleware/postsmiddleware").getRecentPosts;
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Home Page" });
});

router.get("/registration", function (req, res, next) {
  res.render("registration", { title: "Registration Page" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login Page" });
});

router.get("/post", function (req, res, next) {
  res.render("postroom", { title: "Post Room Page" });
});

router.get("/browse-room", getRecentPosts, function (req, res, next) {
  res.render("browse-room", { title: "Browse Room Page" });
});

router.get("/browse-user", function (req, res, next) {
  res.render("browse-user", { title: "Browse User Page" });
});

module.exports = router;
