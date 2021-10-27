/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: logout.js
 *
 * Description: Small front end function that will logout the current user.
 **************************************************************/
/**
 * @author Eddy
 */
const logout = document.getElementById("logout");
// This is a frontend javascript to fetch to the backend to make a post request to logout.
/**
 * A simple event listener to see if a user has selected logout.
 */
logout.addEventListener("click", (e) => {
  if (logout) {
    fetch("/users/logout", {
      method: "POST",
    }).then((data) => {
      // sessionStorage.close();
      location.replace("/");
    });
  }
});
