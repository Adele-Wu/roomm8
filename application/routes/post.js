var express = require("express");
var router = express.Router();
var db = require("../conf/database");
const { successPrint, errorPrint } = require("../helpers/debug/debugprinters");
var sharp = require("sharp");
var multer = require("multer");
var crypto = require("crypto");
var PostModel = require("../models/Posts");
var PostError = require("../helpers/error/PostError");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // path to where we're storing each posts from user.
    cb(null, "public/images/uploads/posts");
  },
  filename: (req, file, cb) => {
    let fileExtension = file.mimetype.split("/")[1];
    let randomHex = crypto.randomBytes(15).toString("hex");
    cb(null, `${randomHex}.${fileExtension}`);
  },
});

var upload = multer({ storage: storage });

router.post("/createPost", upload.single("fileUpload"), (req, res, next) => {
  let fileUploaded = req.file.path;
  let fileAsThumbnail = `thumbnail-${req.file.filename}`;
  let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
  let { title, address, rent, privacy, description } = req.body;
  let users_users_id = req.session.userId; // id name in the db, keeping it consistent
  //   console.log(users_users_id);
  // privacy 1 is private while 0 is shared
  let privacyInt = privacy ? 1 : 0;

  sharp(fileUploaded)
    .resize(200)
    .toFile(destinationOfThumbnail)
    .then(() => {
      return PostModel.create(
        title,
        address,
        rent,
        privacyInt,
        description,
        fileUploaded,
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
  try {
    let searchTerm = req.query.search;
    if (!searchTerm) {
      res.send({
        results: [],
      });
    } else {
      let results = await PostModel.search(searchTerm);
      if (results.length) {
        res.send({
          results: results,
        });
      } else {
        let results = await PostModel.getTenMostRecent(10);
        res.send({
          results: results,
        });
      }
    }
  } catch (err) {
    next(err);
  }
});

router.get("/:id(\\d+)", async (req, res, next) => {
  try {
    let usernameTitle = "";
    let baseSQL =
      "SELECT u.username, p.title, p.description, p.photopath, p.created \
    FROM users u \
    JOIN posts p \
    on u.user_id = p.users_user_id \
    WHERE p.post_id = ?";
    let [results, fields] = await db.execute(baseSQL, [req.params.id]);
    if (results && results.length) {
      let baseSQL2 =
        "SELECT m.users_user_id, m.description, m.posts_post_id, m.created \
      FROM posts p \
      JOIN messages m\
      on p.post_id = posts_post_id \
      WHERE p.post_id = ? \
      ORDER BY m.created DESC;";
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

module.exports = router;
