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
    // cleaning house
  } else {
    gmap.pinpointLocation(searchTerm.value);
  }
}

function createPost(post) {
  // edited this output stream with the proper div location to wrap the button
  return `
    <div id="${post.post_id}" class="item card" style="height:500px">
      <img class="cardImage  max-w-screen-lg mx-auto" src="images/uploads/posts/${post.thumbnail}" id="${post.post_id}" alt="room" />
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
