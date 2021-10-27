/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: users.js
 *
 * Description: users router that will handle all user routes that will
 * check and validate all incoming user inputs and then send to the
 * Users Model.
 **************************************************************/
const delay = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });
};

/**
 * essentially a promise maker. You pass in the session object such that
 * it returns a promise.
 * @param {*} session
 * @returns resolve or reject.
 */
const sessionSave = (session) => {
  return new Promise((resolve, reject) => {
    session.save((err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

// const promiseSave = (req) => {
//   return new Promise((resolve, reject) => {
//     req.session.save((err) => {
//       console.log("ERROR " + err);
//       return reject(err);
//     });
//     return setTimeout(() => {
//       return resolve();
//     }, 2000);
//   });
// };
// const sessionSave = (session) => {
//   return new Promise((resolve, reject) => {
//     session.save((err) => {
//       if (err) {
//         console.log("ERR " + err);
//         return reject(err);
//       }
//       console.log("success " + err);
//       return resolve();
//     });
//   });
// };

module.exports = { sessionSave, delay };
