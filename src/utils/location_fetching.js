import axios from "axios";

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

    const response = await axios.get(
      "http://localhost:5000/api/fetch-nearby-restaurants",
      {
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
