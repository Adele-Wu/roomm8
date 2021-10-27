/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: google-map.js
 *
 * Description: Google Map class that will initialize our map as well
 * create all the necessary markers for any and all searches and filter
 * for posts.
 **************************************************************/
/**
 * @author Eddy
 */
const ROADMAP = "roadmap";

/**
 * Initialize map with San Francisco as the default location.
 *
 * @function initMap
 */
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

/** @class GoogleMap representing our map object */
class GoogleMap {
  /**
   * @constructor
   * @param {number} id
   * @param {object} locations {lat, lng}
   */
  constructor(id, locations = []) {
    this.id = id;
    this.locations = locations;
  }
  /**
   * @function draw placement of each marker
   */
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

  /**
   * @function addMarker insert into locations array
   */
  addMarker(lat, lng) {
    this.locations.push({ lat, lng });
    this.draw();
  }

  /**
   * pinpointLocation is used to find their geolocation base on their address using GeoCode API
   *
   * @function pinpointLocation creates connection and returns googlemap object
   * @param address literal address
   */
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
