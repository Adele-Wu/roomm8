/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: search-user.js
 *
 * Description: Frontend search that will use client-side rendering
 * such that we have a more dynamic feel as a user searches for user(s).
 **************************************************************/
const searchButton = document.getElementById("search-button");

if (searchButton) {
  searchButton.onclick = executeSearch;
}

async function executeSearch() {
  let searchTerm = document.getElementById("search-text");
  // if the users doesn't search for anything redirect back to the same room
  if (!searchTerm) {
    location.replace("/browse-user");
    return;
  }
  // if the users is looking for a users than we know that the username starts with an alphabet
  // else will be an address
  else {
    let mainContent = document.getElementById("room_results");
    let searchURL = `users/search?search=${searchTerm.value}`;
    let response = await axios.get(searchURL);
    if (!response) {
      location.replace("/browse-user");
      return;
    }
    let newMainContentHTML = "";
    response.data.results.forEach((user) => {
      newMainContentHTML += createUserCard(user);
    });
    mainContent.innerHTML = newMainContentHTML;
  }
}

// TODO: src="images/uploads/users/${user.photopath}"
// path above is needed for anyone who's going to EDIT their profile.
// come back to this when you implement the next steps of registration. (create user preferences)
function createUserCard(user) {
  user.dob = user.dob.slice(0, 10);
  return `
  <div id="${user.user_id}" class="item card">
    <img
        class="cardImage max-w-screen-lg mx-auto"
        src="./images/Smiley_Face.JPG"
        id="${user.user_id}"
        alt="face"
    />
    <div class="break-words">
        <p class="font-bold text-lg">${user.first_name} ${user.last_name}</p>
        <p class="">${user.gender}</p>
        <p class="">${user.dob}</p>
        <p class="">${user.fields}</p>
        <p class="">${user.school}</p>
        <p class="">${user.email}</p>
        <p class="">${user.username}</p>
        <p class="">${user.desciption}</p>
    </div>
    <button class="postButton">
        <a href="/users/${user.user_id}">Display
        ${user.username}</a></button>
    </div>
    `;
}
