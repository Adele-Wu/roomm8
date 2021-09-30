const google_map_submit = document.getElementById("google_map_submit");
const google_map_address = document.getElementById("google_map_address");

// Google Map Javascript Api
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: 37.775, lng: -122.419 },
  });
  // new google.maps.Marker({
  //   position: { lat: 37.775, lng: -122.419 },
  //   map,
  // });
}

google_map_submit.addEventListener("click", () => {
  let BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
  let API_KEY = "AIzaSyDIE-MIgEos6ePPbsLh9gQ7nJqEX_TwfuU";
  let url = BASE_URL + google_map_address.value + "&key=" + API_KEY;
  let lat, long;
  axios
    .get(url)
    .then((res) => {
      if (res) {
        // console.log(res.data.results[0].geometry.location.lat);
        lat = res.data.results[0].geometry.location.lat;
        long = res.data.results[0].geometry.location.lng;
        setMarker(lat, long);
      } else {
        console.log("Couldn't find address.");
      }
    })
    .catch((err) => console.log(err));
});

function setMarker(lat, lng) {
  var myLatlng = new google.maps.LatLng(lat, lng);
  const mapOptions = {
    zoom: 14,
    center: myLatlng,
  };
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  var marker = new google.maps.Marker({
    position: myLatlng,
  });
  marker.setMap(map);
}

// ******************** Ignore below

// class GoogleMap {
//   constructor(id, locations = []) {
//     this.id = id;
//     this.locations = locations;
//   }

//   draw() {
//     map = new google.maps.Map(document.getElementById(this.id), {
//       zoom: 8,
//       center: this.locations[this.locations.length - 1],
//       mapTypeId: google.maps.MapTypeId.ROADMAP,
//     });

//     for(let i = 0; i < this.locations.length; i++){
//       new google.maps.Marker({
//         position: { lat: this.locations.lat, lng: this.locations.lng },
//         map: map,
//       })
//     }
//   }

//   addMarker(lat, lng) {
//     location.push({lat, lng});
//     this.draw();
//   }

//   async pinpointLocation(address){
//     const api = `https://map.googleapis.com/maps/api/geocode/json?address=${address}&key=`

//     let response = await axios.get(api);
//     this.addMarker(
//       response.data.results[0].geometry.location.lat,
//       response.data.results[0].geometry.location.lng,
//     )
//   }
// }
