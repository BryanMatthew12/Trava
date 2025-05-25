import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config";

export const postPrePlanning = async (
  title,
  start,
  end,
  budget,
  destination,
  destinationId
) => {
  try {
    const token = Cookies.get("token");

    const payload = {
      itinerary_name: title,
      start_date: start,
      end_date: end,
      budget: budget,
      destination_id: destinationId,
    };

    const response = await axios.post(
      `${BASE_URL}/v1/itineraries`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.id; // Return the itinerary ID
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
