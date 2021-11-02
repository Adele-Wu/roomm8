/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: UserError.js
 *
 * Description: A helper class that generates a message and redirect
 * their respected page if necessary
 **************************************************************/
class UserError extends Error {
  constructor(message, redirectURL, status) {
    super(message);
    this.redirectURL = redirectURL;
    this.status = status;
  }
  getMessage() {
    return this.message;
  }
  getRedirectURL() {
    return this.RedirectURL;
  }
  getStatus() {
    return this.status;
  }
}

module.exports = UserError;
