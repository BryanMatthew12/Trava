import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config";

export const updatePlace = async (id, body, placeId) => {
  try {
    const token = Cookies.get("token");

    const response = await axios.patch(
      `${BASE_URL}/v1/places/${placeId}`, // Your actual endpoint
      body, // Send the full body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Return actual response data
  } catch (error) {
    console.error(
      "Error updating place:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Error updating place");
  }
};
