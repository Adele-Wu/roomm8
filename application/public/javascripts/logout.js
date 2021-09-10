const logout = document.getElementById("logout");

logout.addEventListener("click", (e) => {
    if(logout){
        fetch('/users/logout', {
            method: "POST"
        })
        .then((data) => {
            // sessionStorage.close();
            location.replace('/');
        })
    }
});
