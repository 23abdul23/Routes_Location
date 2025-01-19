// Initialize the map
let marker;
let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 15,
  });

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Update the map and marker
        if (!marker) {
          marker = new google.maps.Marker({
            position: pos,
            map: map,
          });
        } else {
          marker.setPosition(pos);
        }

        map.setCenter(pos);

        // Fetch the road name
        fetchRoadInfo(pos.lat, pos.lng);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Error: Unable to retrieve location.");
      },
      { enableHighAccuracy: true }
    );
  } else {
    alert("Error: Your browser doesn't support geolocation.");
  }
}

// Fetch road information using Google Geocoding API
function fetchRoadInfo(lat, lng) {
  const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAuEhR-w0xHeWZKR6EC8geXgqH7RxLDKKk`;

  fetch(geocodingApiUrl)
    .then((response) => response.json())
    .then((data) => {
      const addressComponents = data.results[0]?.address_components;
      const road = addressComponents?.find((comp) =>
        comp.types.includes("route")
      )?.long_name;

      document.getElementById("road-info").innerText = road
        ? `You are on: ${road}`
        : "Road information not available.";
    })
    .catch((error) => {
      console.error("Error fetching road info:", error);
      document.getElementById("road-info").innerText =
        "Error fetching road information.";
    });
}

// Load the map
window.onload = initMap;
