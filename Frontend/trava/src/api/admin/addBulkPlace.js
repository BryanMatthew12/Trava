import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie to access cookies
import { BASE_URL } from "../../config";

export const addBulkPlace = async (body) => {
  try {
    const token = Cookies.get("token");

    // Convert the body object into query parameters
    const queryParams = new URLSearchParams(body).toString();

    const response = await axios.get(
      `${BASE_URL}/v1/search-places?${queryParams}`, // Append query parameters to the URL
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching bulk places:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "An error occurred while fetching bulk places."
    );
  }
};
