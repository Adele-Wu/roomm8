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
