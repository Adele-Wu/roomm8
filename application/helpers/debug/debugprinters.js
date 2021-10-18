/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: debugprinters.js
 *
 * Description: A helper method that will create color for debugging purposes.
 **************************************************************/
const colors = require("colors");

colors.setTheme({
  error: ["black", "bgRed"],
  success: ["black", "bgGreen"],
  request: ["black", "bgWhite"],
});

const printers = {
  errorPrint: (message) => {
    console.log(colors.error(message));
  },
  successPrint: (message) => {
    console.log(colors.success(message));
  },
  requestPrint: (message) => {
    console.log(colors.request(message));
  },
};

module.exports = printers;
