import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie to access cookies
import { BASE_URL } from "../../config";

export const fetchDayId = async (
  itineraryId,
) => {
  try {
    const token = Cookies.get("token");

    const response = await axios.get(
      `${BASE_URL}/v1/itineraries/${itineraryId}/days`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data

  } catch (error) {
    console.error(
        "Error fetching coordinates:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "An error occurred while fetching coordinates."
    );
  }
};
