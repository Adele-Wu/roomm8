/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: search-post.js
 *
 * Description: Frontend search that will use client-side rendering
 * such that we have a more dynamic feel as a user searches for a post.
 **************************************************************/
/**
 * @author Eddy
 */
const searchButton = document.getElementById("search-button");
/**
 * GoogleMap Object to generate all the markers
 */
const gmap = new GoogleMap("map");

if (searchButton) {
  searchButton.onclick = executeSearch;
}
/**
 * Generates all the necessary innerHTML from the results of a query
 * and googlemap object to generate the markers based on their lat lng.
 *
 * @function executeSearch
 */
async function executeSearch() {
  let searchTerm = document.getElementById("search-text");
  // if the users doesn't search for anything redirect back to the same room
  if (!searchTerm) {
    location.replace("/browse-room");
    return;
  }

  // if the users is looking for a users than we know that the username starts with an alphabet
  // else will be an address
  let isUser = /[a-zA-Z]/.test(searchTerm.value.charAt(0));
  if (isUser) {
    let mainContent = document.getElementById("room_results");
    let searchURL = `post/search?search=${searchTerm.value}`;

    let response = await axios.get(searchURL);
    if (!response) {
      location.replace("/browse-room");
      return;
    }
    let newMainContentHTML = "";
    response.data.results.forEach((post) => {
      newMainContentHTML += createPost(post);
      gmap.pinpointLocation(post.address);
    });
    mainContent.innerHTML = newMainContentHTML;
  } else {
    gmap.pinpointLocation(searchTerm.value);
  }
}

/**
 * As the function name suggest, this is the blueprint for each individual card
 * based on the n number of results.
 *
 * @function createPost
 * @param post
 */
function createPost(post) {
  // edited this output stream with the proper div location to wrap the button
  return `
    <div id="${post.post_id}" class="item card" style="height:500px">
      <img class="cardImage roomImage max-w-screen-lg mx-auto" src="images/uploads/posts/${post.thumbnail}" id="${post.post_id}" alt="room" />
      <div class="cardBody break-words">
        <p class="cardTitle font-bold text-lg">${post.title}</p>
        <p class="cardAddress">${post.address}</p>
        <p class="cardDescription">${post.description}</p>
        <button class="postButton">
        <a href="/post/${post.post_id}">
        Check Post
        </a>
       </button>
      </div>
    </div>
    `;
}
