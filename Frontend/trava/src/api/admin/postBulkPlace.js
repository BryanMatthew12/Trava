import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie to access cookies
import { BASE_URL } from "../../config";

export const postBulkPlace = async (body) => {
  try {
    const token = Cookies.get("token");

    const response = await axios.post(
      `${BASE_URL}/v1/places/bulk-store`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Explicitly check for success status
    if (response) {
      return response.data; // Return the response data
    } else {
      console.error("Unexpected response status:", response.status);
      throw new Error("Unexpected response status");
    }
  } catch (error) {
    console.error(
      "Error posting itinerary:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error posting bulk place data"
    );
  }
};
