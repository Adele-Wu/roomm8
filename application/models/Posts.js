var db = require("../conf/database");
const PostModel = {};

PostModel.create = (
  title,
  address,
  rent,
  privacyInt,
  description,
  photopath,
  thumbnail,
  users_user_id
) => {
  let baseSQL =
    "INSERT INTO posts (title, address, rent, privacy, description, photopath, thumbnail, created, users_user_id) VALUE (?, ?, ?, ?, ?, ?, ?, now(), ?)";

  return db
    .execute(baseSQL, [
      title,
      address,
      rent,
      privacyInt,
      description,
      photopath,
      thumbnail,
      users_user_id,
    ])
    .then(([results, fields]) => {
      return Promise.resolve(results && results.affectedRows);
    })
    .catch((err) => err);
};

PostModel.search = (searchTerm) => {};

PostModel.getTenMostRecent = async (numberOfPosts) => {
  let baseSQL =
    "SELECT post_id, title, address, rent, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT 10;";
  return db
    .execute(baseSQL, [numberOfPosts])
    .then(([results, fields]) => {
      return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

module.exports = PostModel;
