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

const logout = document.getElementById("logout");
// This is a frontend javascript to fetch to the backend to make a post request to logout.
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
