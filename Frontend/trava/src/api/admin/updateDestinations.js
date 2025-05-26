import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config";

// data = { description, destination_picture, ... }
export const updateDestinationById = async (id, data) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.patch(
      `${BASE_URL}/v1/destinations/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};