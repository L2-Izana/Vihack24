import axios from "axios";
import { NGROK_URL_BACKEND_URL } from "./ngrok_url";

axios.defaults.headers.common["Authorization"] =
  "Bearer 2knRKVCJLyGdMVwnxu6c7VN9d8o_4ouHeJmhZ7TuT1xruLu5e";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const fetchNearbyRestaurant = async (
  budgetLevel,
  foodTypes,
  cuisines
) => {
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
    console.log(budgetLevel);
    console.log(foodTypes);
    console.log(cuisines);
    const response = await axios.post(
      `${NGROK_URL_BACKEND_URL}api/get-restaurant-recommendations`,
      {
        latitude,
        longitude,
        budgetLevel,
        foodTypes,
        cuisines,
      },
      {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("There was an error fetching nearby restaurants:", error);
    throw error;
  }
};

const getPlaceDetails = async (placeId) => {
  const url = "https://maps.googleapis.com/maps/api/place/details/json";
  const params = {
    place_id: placeId,
    key: "AIzaSyDS3_F0Aer1Z2rq4jeqp7u3VCFrdqJLuFM",
  };

  try {
    const response = await axios.get(url, { params });
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching details for place ID ${placeId}:`, error);
    return null;
  }
};

export const getRestaurantSuggestions = async () => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser");
  }

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const response = await axios.get(
      `${NGROK_URL_BACKEND_URL}api/get-restaurant-suggestions`,
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

    const restaurants = response.data;
    console.log(restaurants);
    // Fetch detailed information for each restaurant
    const detailedRestaurants = await Promise.all(
      restaurants.map(async (restaurant) => {
        const details = await getPlaceDetails(restaurant.place_id);
        return {
          ...restaurant,
          photo_reference: details?.photos?.[0]?.photo_reference || null,
          opening_hours: details?.opening_hours || null,
          rating: details?.rating || null,
        };
      })
    );

    return detailedRestaurants;
  } catch (error) {
    console.error("Error fetching restaurant suggestions:", error);
    return [];
  }
};
