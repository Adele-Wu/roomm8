/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: Posts.js
 *
 * Description: Post model that handles all of database queries to return
 * their corresponding data for their respected pages.
 **************************************************************/
var db = require("../conf/database");
const Post = {};

/**
 * The create method is used to create each post tied to a specific
 * user.
 *
 * @param {*} title
 * @param {*} address
 * @param {*} rent
 * @param {*} privacyInt
 * @param {*} description
 * @param {*} photopath
 * @param {*} thumbnail
 * @param {*} users_user_id
 * @returns a promise resolve
 */
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

/**
 * A general query to return 10 most recent post. We can pass in any integer
 * to return n number of row results back to the frontend.
 *
 * @param {*} numberOfPosts
 * @returns
 */
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

/**
 * search will concatonate the title and description together and use a wildcard to find
 * any word in either the title or description as a row result.
 *
 * @param {*} searchTerm
 * @returns row results
 */
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

/**
 * filter will filter the client's selected options
 *
 * @param {*} parsedObject
 * @returns row results
 */
Post.filter = async function (parsedObject) {
  let fields = [];
  let baseSQL =
    "SELECT DISTINCT post_id,title, address, rent, description, thumbnail FROM posts p ";
  if (parsedObject.disability || parsedObject.parking) {
    baseSQL += `
    join
      posts_amenities pa
    on
      p.post_id = pa.posts_post_id
    join
      amenities a
    on
      a.amenities_id = pa.amenities_amenities_id
    and
      a.amenity in (`;
    if (parsedObject.parking && !parsedObject.disability) {
      baseSQL += `?)`;
      fields.push(parsedObject.parking);
    }
    if (parsedObject.disability && !parsedObject.parking) {
      baseSQL += `?)`;
      fields.push(parsedObject.disability);
    }
    if (parsedObject.disability && parsedObject.parking) {
      baseSQL += `?,?)`;
      fields.push(parsedObject.disability);
      fields.push(parsedObject.parking);
    }
    if (parsedObject.maxPriceRange || Number.isInteger(parsedObject.privacy)) {
      baseSQL += ` AND `;
      if (parsedObject.maxPriceRange) {
        baseSQL += `p.rent BETWEEN ${parsedObject.minPriceRange} AND ${parsedObject.maxPriceRange} `;
      }
      if (
        parsedObject.maxPriceRange &&
        Number.isInteger(parsedObject.privacy)
      ) {
        baseSQL += ` AND `;
      }
      if (Number.isInteger(parsedObject.privacy)) {
        baseSQL += ` p.privacy = "${parsedObject.privacy}";`;
      }
    }
  } else {
    baseSQL += ` WHERE `;
    if (parsedObject.maxPriceRange) {
      baseSQL += `p.rent BETWEEN ${parsedObject.minPriceRange} AND ${parsedObject.maxPriceRange} `;
    }
    if (parsedObject.maxPriceRange && Number.isInteger(parsedObject.privacy)) {
      baseSQL += ` AND `;
    }
    if (Number.isInteger(parsedObject.privacy)) {
      baseSQL += ` privacy = "${parsedObject.privacy}";`;
    }
  }
  // console.log(baseSQL);
  return db
    .execute(baseSQL, fields)
    .then(([results, fields]) => {
      return results;
    })
    .catch((err) => Promise.reject(err));
};

module.exports = Post;
