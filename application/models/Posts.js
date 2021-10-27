/* ============================================================================================

  * Project: ROOMM8 (Room and Roommate Finder for College Students & Professionals)
  * Class: CSC-648-02 Software Engineering Final Project 
  * Fall 2021
  * TEAM 5 MEMBERS
    > Edward Yun, 
    > Jeffrey Fullmer Gradner, 
    > Adele Wu, 
    > Jeff Friedrich,
    > Kris Byington, 
    > Jose Quinteros
  
  * File: about_me.hbs
  * Description: contains...
  
  ================================================================================================= */

var db = require("../conf/database");
const Post = {};

Post.create = async (
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

Post.getTenMostRecent = async (numberOfPosts) => {
  let baseSQL =
    "SELECT post_id, title, address, rent, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT " +
    numberOfPosts +
    ";";
  return db
    .execute(baseSQL, [numberOfPosts])
    .then(([results, fields]) => {
      return results;
    })
    .catch((err) => Promise.reject(err));
};

Post.search = async (searchTerm) => {
  let baseSQL =
    "SELECT post_id, title, address, rent, description, thumbnail, concat_ws(' ', title, description) \
  AS haystack \
  FROM posts \
  HAVING haystack like ?";
  let sqlReadySearchTerm = "%" + searchTerm + "%";
  return db
    .execute(baseSQL, [sqlReadySearchTerm])
    .then(([results, fields]) => {
      return results;
    })
    .catch((err) => Promise.reject(err));
};

module.exports = Post;
