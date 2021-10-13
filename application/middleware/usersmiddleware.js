var User = require("../models/Users");
const usersMiddleWare = {};

usersMiddleWare.getRecentUsers = async function (req, res, next) {
  try {
    let results = await User.getTenMostRecent(10);
    res.locals.results = results;
    if (results.length == 0) {
      console.log("error");
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = usersMiddleWare;
