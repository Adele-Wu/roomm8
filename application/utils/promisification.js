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

const delay = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });
};

const sessionSave = (session) => {
  return new Promise((resolve, reject) => {
    session.save((err) => {
      if (err) {
        // console.log("ERR " + err);
        reject(err);
      }
      // console.log("success " + err);
      resolve();
    });
  });
};

module.exports = { sessionSave, delay };
