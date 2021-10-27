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


// const google_map_submit = document.getElementById("google_map_submit");
// const google_map_address = document.getElementById("google_map_address");

// // Google Map Javascript Api
// function initMap() {
//   const map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 8,
//     center: { lat: 37.775, lng: -122.419 },
//   });
//   // new google.maps.Marker({
//   //   position: { lat: 37.775, lng: -122.419 },
//   //   map,
//   // });
// }

// google_map_submit.addEventListener("click", () => {
//   let BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
//   let API_KEY = "AIzaSyDIE-MIgEos6ePPbsLh9gQ7nJqEX_TwfuU";
//   let url = BASE_URL + google_map_address.value + "&key=" + API_KEY;
//   let lat, long;
//   axios
//     .get(url)
//     .then((res) => {
//       if (res) {
//         // console.log(res.data.results[0].geometry.location.lat);
//         lat = res.data.results[0].geometry.location.lat;
//         long = res.data.results[0].geometry.location.lng;
//         setMarker(lat, long);
//       } else {
//         console.log("Couldn't find address.");
//       }
//     })
//     .catch((err) => console.log(err));
// });

// function setMarker(lat, lng) {
//   var myLatlng = new google.maps.LatLng(lat, lng);
//   const mapOptions = {
//     zoom: 14,
//     center: myLatlng,
//   };
//   var map = new google.maps.Map(document.getElementById("map"), mapOptions);
//   var marker = new google.maps.Marker({
//     position: myLatlng,
//   });
//   marker.setMap(map);
// }

const ROADMAP = "roadmap";

function initMap() {
  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 37.775, lng: -122.419 },
  });
  // uncomment these if we want to have a initial marker.
  // new google.maps.Marker({
  //   position: { lat: 37.775, lng: -122.419 },
  //   map,
  // });
}

class GoogleMap {
  constructor(id, locations = []) {
    this.id = id;
    this.locations = locations;
  }

  draw() {
    map = new google.maps.Map(document.getElementById(this.id), {
      zoom: 12,
      center: this.locations[this.locations.length - 1],
      // mapTypeId: google.maps.mapTypeId.ROADMAP,
      mapTypeId: ROADMAP,
    });
    for (let i = 0; i < this.locations.length; i++) {
      new google.maps.Marker({
        position: {
          lat: this.locations[i].lat,
          lng: this.locations[i].lng,
        },
        map: map,
      });
    }
  }

  addMarker(lat, lng) {
    this.locations.push({ lat, lng });
    this.draw();
  }

  async pinpointLocation(address) {
    let api = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=`;
    // add api key | may need to add a different one so I don't get charged like a billion dollars
    // TODO WE NEED AN API KEY FOR THIS TO WORK!!!!!!!!!!!!
    api += "AIzaSyAPXLO7hv5qBFm4sz0NSxnLOc41O4GFl60";
    let response = await axios.get(api);
    this.addMarker(
      response.data.results[0].geometry.location.lat,
      response.data.results[0].geometry.location.lng
    );
  }
}
