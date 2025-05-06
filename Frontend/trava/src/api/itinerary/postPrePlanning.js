import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie to access cookies
import { BASE_URL } from "../../config";

export const postPrePlanning = async (
  start,
  end,
  budget,
  desc,
  destination,
  destinationId,
  navigate
) => {
  try {
    const token = Cookies.get("token");

    const response = await axios.post(
      `${BASE_URL}/v1/itineraries`,
      {
        start_date: start,
        end_date: end,
        budget: budget,
        itinerary_description: desc,
        destination_name: destination,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const itineraryId = response.data.id; // Get the id from the response

    // Pass the data as an object using the `state` parameter
    navigate(`/PlanningItinerary?source=header&params=${itineraryId}`, {
      state: {
        itineraryId,
        start,
        end,
        budget,
        desc,
        destination,
        destinationId,
      },
    });
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
