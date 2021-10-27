/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: filter-post.js
 *
 * Description: Frontend JS that parses the necessary parameters and
 * sent to the backend and retrieves and renders the filtered posts.
 **************************************************************/
const filterButton = document.getElementById("filter-button");
// const gmap = new GoogleMap("map");

if (filterButton) {
  filterButton.onclick = executeFilter;
}
/**
 * Generates all the necessary innerHTML from the results of a query
 * and googlemap object to generate the markers based on their lat lng.
 * Main difference is the complexity of various different options. Therefore,
 * we need to elegantly handle each case.
 *
 * @function executeFilter
 */
async function executeFilter() {
  let minPriceRangeId = document.getElementById("minPriceRange").value;
  let maxPriceRangeId = document.getElementById("maxPriceRange").value;
  let privacyId;
  let parkingId;
  let disabilityId;

  if (document.getElementById("privateroom").checked)
    privacyId = document.getElementById("privateroom").value;

  if (document.getElementById("sharedroom").checked)
    privacyId = document.getElementById("sharedroom").value;

  if (document.getElementById("parking").checked)
    parkingId = document.getElementById("parking").value;

  if (document.getElementById("disability").checked)
    disabilityId = document.getElementById("disability").value;

  let filterObject = {
    minPriceRange: minPriceRangeId || 0,
    maxPriceRange: maxPriceRangeId || 90000,
    privacy: privacyId,
    parking: parkingId,
    disability: disabilityId,
  };

  let response = await axios.get("/post/filter", { params: filterObject });
  if (!response) {
    location.replace("/browse-room");
    return;
  }

  let newMainContentHTML = "";
  let mainContent = document.getElementById("room_results");
  response.data.results.forEach((post) => {
    newMainContentHTML += createFilteredPost(post);
    // gmap.pinpointLocation(post.address);
  });
  mainContent.innerHTML = newMainContentHTML;
}

/**
 * As the function name suggest, this is the blueprint for each individual card
 * based on the n number of results.
 *
 * @function createFilteredPost
 * @param post
 */
function createFilteredPost(post) {
  // edited this output stream with the proper div location to wrap the button
  return `
    <div id="${post.post_id}" class="item card">
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
