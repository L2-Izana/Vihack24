import axios from "axios";
import { NGROK_URL_BACKEND_URL } from "./ngrok_url";

axios.defaults.headers.common["Authorization"] =
  "Bearer 2knRKVCJLyGdMVwnxu6c7VN9d8o_4ouHeJmhZ7TuT1xruLu5e";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const fetchNearbyRestaurant = async () => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser");
  }

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude);
    console.log(longitude);

    const response = await axios.get(
      `${NGROK_URL_BACKEND_URL}api/get-restaurant-recommendations`,
      {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
        params: {
          latitude: latitude,
          longitude: longitude,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("There was an error fetching nearby restaurants:", error);
    throw error;
  }
};
