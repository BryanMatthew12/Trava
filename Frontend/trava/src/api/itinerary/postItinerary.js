import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie to access cookies
import { BASE_URL } from "../../config";

export const postItinerary = async (id, destination_id, body, navigate) => {
  try {
    const token = Cookies.get("token");

    const response = await axios.post(
      `${BASE_URL}/v1/itinerary-destinations`,
      {
        itinerary_id: id, // Use "itinerary_id" as expected by the API
        destination_id: destination_id, // Use "destination_id" as expected by the API
        destinations: body, // Pass the destinations array
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Explicitly check for success status
    if (response) {
      navigate(`/home`); // Navigate to the home page on success
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
      error.response?.data?.message || "Error posting itinerary"
    );
  }
};
