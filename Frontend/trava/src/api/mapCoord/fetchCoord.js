import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie to access cookies
import { BASE_URL } from "../../config";

export const fetchCoord = async (
  name
) => {
  try {
    const token = Cookies.get("token");

    const response = await axios.post(
      `${BASE_URL}/v1/locations`,
      {
        location_name: name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response

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
