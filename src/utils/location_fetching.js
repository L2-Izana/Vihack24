const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const apiUrl = process.env.REACT_APP_GOOGLE_MAPS_API_URL;
const radius = 500;
const type = "restaurant";

function fetchNearbyRestaurants() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const url = `${apiUrl}?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;
      console.log("Fetch URL:", url);
      fetch(url)
        .then((response) => response.json())
        .then((data) =>
          data["results"].map((restaurant) =>
            console.log(restaurant["place_id"])
          )
        )
        .catch((error) => {
          console.error("Error:", error);
          throw error;
        });
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

module.exports = { fetchNearbyRestaurants };
