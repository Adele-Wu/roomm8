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

const searchButton = document.getElementById("search-button");
const gmap = new GoogleMap("map");

if (searchButton) {
  searchButton.onclick = executeSearch;
}

async function executeSearch() {  
  let searchTerm = document.getElementById("search-text");
// if the users doesn't search for anything redirect back to the same room
if (!searchTerm) {
  location.replace("/browse-room");
  return;
}
let minPricerange = document.getElementById("minRange");
let languages = document.getElementById("language");
var selected = "";
for (var option of languages.options)
  {
      if (option.selected) {
          selected= selected+","+option.value;
      }
  }
  // if the users is looking for a users than we know that the username starts with an alphabet
  // else will be an address
  let isUser = /[a-zA-Z]/.test(searchTerm.value.charAt(0));
  if (isUser) {
    let mainContent = document.getElementById("room_results");
    let searchURL = `post/search?search=${searchTerm.value}`;
    let response = await axios.get(searchURL);
    //console.log(response);
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
    // fetch(searchURL)
    //   .then((data) => {
    //     return data.json();
    //   })
    //   .then((data_json) => {
    //     let newMainContentHMTL = "";
    //     data_json.results.forEach((results) => {
    //       newMainContentHMTL += createPost(results);
    //       gmap.pinpointLocation(results.address);
    //     });
    //     mainContent.innerHTML = newMainContentHMTL;
    //   });
  } else {
    gmap.pinpointLocation(searchTerm.value);
  }
}

function createPost(post) {
  /*return `
    <div id="${post.post_id}" class="item card">
        <img src="images/uploads/posts/${post.thumbnail}" id="${post.post_id}" class="cardImage" alt="room" />
        <div class="cardBody">
            <p class="cardTitle">${post.title}</p>
            <p class="cardAddress">${post.address}</p>
            <p class="cardRent">${post.rent}</p>
            <p class="cardDescription">${post.description}</p>
            <a class="postButton" href="/post/${post.post_id}">Check Post</a>
        </div>
    </div>
    `;
    */
  return `
    <div id="${post.post_id}" class="item card" style="height: 300px">
    <img class="cardImage roomImage max-w-screen-lg mx-auto" src="images/uploads/posts/${post.thumbnail}" id="${post.post_id}" alt="room" />
    <div class="cardBody break-words">
    <p class="cardTitle font-bold text-lg">${post.title}</p>
    <p class="cardAddress">${post.address}</p>
    <p class="cardDescription">${post.description}</p>
    </div>
    <button class="postButton">
    <a href="/post/${post.post_id}">
    Check Post
    </a>
    </button>
    </div>
    `;
}
