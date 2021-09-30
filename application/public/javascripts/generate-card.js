function createPost(postData) {
  return `
    <div id="${postData.post_id}" class="item">
        <img src="../../${postData.thumbnail}" id="${postData.post_id}" alt="room" />
        <div class="cardBody">
            <p class="cardTitle">${postData.title}</p>
            <p class="cardDescription">${postData.description}</p>
            <a class="postButton" href="/post/${postData.post_id}">Check Post</a>
        </div>
    </div>
    `;
}
