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
