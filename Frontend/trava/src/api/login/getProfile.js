import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config";

export const getProfile = async (id) => {
  try {
    const token = Cookies.get("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(
      `${BASE_URL}/v1/users/${id}`,
      { headers }
    );
    // response.data: { username, user_picture }
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching profile:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Error fetching profile");
  }
};