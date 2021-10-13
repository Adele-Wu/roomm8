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
