let searchButton = document.getElementById("search-button");
if (searchButton) {
  searchButton.onclick = executeSearch;
}

function executeSearch() {
  let searchTerm = document.getElementById("search-text");
  if (!searchTerm) {
    location.replace("/");
    return;
  }

  let mainContent = document.getElementById("cardContainer");
  let searchURL = `post/search?search=${searchTerm.value}`;
  fetch(searchURL)
    .then((data) => {
      return data.json();
    })
    .then((data_json) => {
      let newMainContentHMTL = "";
      data_json.results.forEach((row) => {
        newMainContentHMTL += createPost(row);
      });
      mainContent.innerHTML = newMainContentHMTL;
    });
}

function createPost(post) {
  return `
    <div id="${post.post_id}" class="item">
        <img src="images/uploads/posts/${post.thumbnail}" id="${post.post_id}" alt="room" />
        <div class="cardBody">
            <p class="cardTitle">${post.title}</p>
            <p class="cardDescription">${post.description}</p>
            <a class="postButton" href="/post/${post.post_id}">Check Post</a>
        </div>
    </div>
    `;
}
