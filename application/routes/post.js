/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: post.js
 *
 * Description: post router that will handle all post routes that will
 * handle all the logic for storing images, create posts, search, filter,
 * create messages, and link to individual posts.
 * As well as call methods within Post Models for any db queries.
 **************************************************************/
var express = require("express");
var router = express.Router();
var db = require("../conf/database");
const { successPrint, errorPrint } = require("../helpers/debug/debugprinters");
var sharp = require("sharp");
var multer = require("multer");
var crypto = require("crypto");
var Post = require("../models/Posts");
var PostError = require("../helpers/error/PostError");

/**
 * As the name suggests, we are storing the uploaded images to a destination
 * to a specific path with a file name that's encrypted with a random hexadecimal
 * name to ensure that other clients are not privy to other images.
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // path to where we're storing each posts from user.
    cb(null, "public/images/uploads/posts");
  },
  filename: function (req, file, cb) {
    let fileExtension = file.mimetype.split("/")[1];
    let randomHex = crypto.randomBytes(15).toString("hex");
    cb(null, `${randomHex}.${fileExtension}`);
  },
});

var upload = multer({ storage: storage });

/**
 * When /createPost is invoked, upload.single will grab the image from the input tag that
 * has name="fileUpload" and store that into req.file and req.body will contain the other
 * input or text fields as usual. From here, fileUploaded had a bug where the path was given
 * as path\to\destination, but we needed path/to/destination.
 */
router.post("/createPost", upload.single("fileUpload"), (req, res, next) => {
  let fileUploaded = req.file.path;
  let fileAsThumbnail = `thumbnail-${req.file.filename}`;
  let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
  let { title, address, rent, privacy, description } = req.body;
  let users_users_id = req.session.userId; // id name in the db, keeping it consistent
  // privacy 1 is private while 0 is shared
  let privacyInt = privacy ? 1 : 0;
  // weird bug where it's setting \ instead of /
  fileUploaded = fileUploaded.replace(/\\/g, "/");
  let realPath = fileUploaded.slice(6);

  // sharp is used to resize our image // single params in resize is the width // two = width, height
  sharp(fileUploaded)
    .resize(200)
    .toFile(destinationOfThumbnail)
    .then(() => {
      return Post.create(
        title,
        address,
        rent,
        privacyInt,
        description,
        realPath,
        fileAsThumbnail,
        users_users_id
      );
    })
    .then((postWasCreated) => {
      if (postWasCreated) {
        // redirect to listing of other posts
        res.redirect("/browse-room");
      } else {
        throw new PostError(
          "Post could not be created! User can only post once.",
          "postroom",
          200
        );
      }
    })
    .catch((err) => {
      if (err instanceof PostError) {
        errorPrint(err.getMessage());
        res.status(err.getStatus());
        res.redirect(err.getRedirectURL());
      } else {
        next(err);
      }
    });
});

// /post/search?search=value // need to come back to this and
router.get("/search", async (req, res, next) => {
  console.log(req.query);
  try {
    let searchTerm = req.query.search;
    if (!searchTerm) {
      res.send({
        results: [],
      });
    } else {
      let results = await Post.search(searchTerm);
      if (results.length) {
        res.send({
          results: results,
        });
      } else {
        let results = await Post.getTenMostRecent(10);
        res.send({
          results: results,
        });
      }
    }
  } catch (err) {
    next(err);
  }
});

/**
 * When a user selects a specific post, it will render the room's profile
 * with the user, post and messages tied to that specific post id.
 */
router.get("/:id(\\d+)", async (req, res, next) => {
  try {
    let usernameTitle = "";
    let baseSQL = `SELECT u.username, u.first_name, u.last_name, u.gender, u.dob, u.occupation, u.fields, u.school, u.email, u.username, u.photopath, u.description, p.title, p.description, p.photopath, p.created, p.address, p.rent, p.privacy  \
          FROM users u \
          JOIN posts p \
          on u.user_id = p.users_user_id \
          WHERE p.post_id = ?`;
    let [results, fields] = await db.execute(baseSQL, [req.params.id]);
    if (results && results.length) {
      let baseSQL2 = `SELECT m.users_user_id, m.description, m.posts_post_id, m.created \
          FROM posts p \
          JOIN messages m \
          on p.post_id = posts_post_id \
          WHERE p.post_id = ? \
          ORDER BY m.created DESC;`;
      let [results2, fields2] = await db.execute(baseSQL2, [req.params.id]);
      req.session.viewing = req.params.id;
      usernameTitle += results[0].username + "'s Room Profile";
      res.render("room-profile", {
        title: usernameTitle,
        currentPost: results[0],
        comments: results2,
      });
    }
  } catch (err) {
    console.log(err);
    res.redirect("/browse-room");
  }
});

/**
 * /filter will filter posts by parsing the user's selection within a form tag
 * and format the data and catch of any client errors.
 * i.e. if a user were to input only a minimum value, then the maximum value would
 * default $900,000 and vis-versa.
 */
router.get("/filter", async function (req, res, next) {
  // let parseObject = Object.fromEntries(
  //   Object.entries(req.query.filterObject).filter(([_, v]) => v != "")
  // );
  try {
    let parseObject = req.query;
    if (Object.keys(parseObject).length === 0) {
      response.redirect("/browse-room");
    } else {
      if (parseObject.privacy) {
        if (parseObject.privacy === "private") {
          parseObject.privacy = 1;
        } else if (parseObject.privacy === "shared") {
          parseObject.privacy = 0;
        }
      }
      if (parseObject.minPriceRange || parseObject.maxPriceRange) {
        if (!parseObject.minPriceRange) {
          parseObject.minPriceRange = 0.0;
          parseObject.maxPriceRange = parseFloat(parseObject.maxPriceRange);
        }
        if (!parseObject.maxPriceRange) {
          parseObject.maxPriceRange = 900000.0;
          parseObject.minPriceRange = parseFloat(parseObject.minPriceRange);
        }
      }
      let results = await Post.filter(parseObject);
      if (results.length) {
        res.send({ results: results });
      } else {
        results = await Post.getTenMostRecent(10);
        res.send({ results: results });
      }
      return;
    }
  } catch (err) {
    console.log(err);
  }
});

/**
 * /messages is simple query to the message table that is tied to the user and post
 * table in a many to many relationship (mysql indexing techinique).
 */

//there's a bug here. route not found

router.post("/messages", async (req, res, next) => {
  const comment = req.body.comment;
  try {
    const fk_userId = req.session.userId;
    const postId = req.session.viewing;
    if (!fk_userId) {
      // TODO: for later we can add flash comments and redirect to log in
      res.redirect("/login");
      // res.redirect("/post/" + postId);
    }
    console.log(comment, fk_userId, postId);

    const baseSQL =
      "INSERT INTO messages (description, users_user_id, posts_post_id, created) VALUES (?, ?, ?, NOW())";
    await db
      .execute(baseSQL, [comment, fk_userId, postId])
      .then((results) => {
        res.redirect("/post/" + postId);
      })
      .catch((err) => console.log("Comment " + err));
  } catch (err) {
    console.log(err);
    res.redirect("/post/" + postId);
  }
});

module.exports = router;
