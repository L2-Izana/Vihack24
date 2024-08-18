import axios from "axios";
import { NGROK_URL_BACKEND_URL } from "./ngrok_url";
axios.defaults.headers.common["Authorization"] =
  "Bearer 2knRKVCJLyGdMVwnxu6c7VN9d8o_4ouHeJmhZ7TuT1xruLu5e";

export const collectUserBaseInfo = async (data) => {
  try {
    const response = await axios.post(
      `${NGROK_URL_BACKEND_URL}api/collect-user-base-info`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Error collecting user base info:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
