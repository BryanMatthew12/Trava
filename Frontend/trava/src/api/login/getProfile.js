import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config";

export const getProfile = async (id, navigate) => {
  try {
    const token = Cookies.get("token");

    // Redirect to login if token is missing
    if (!token) {
      navigate("/login");
      return null; // Return null to indicate no profile data
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(`${BASE_URL}/v1/users/${id}`, { headers });
    return response.data; // Return profile data
  } catch (error) {
    console.error(
      "Error fetching profile:",
      error.response?.data?.message || error.message
    );

    // Redirect to login if the error is related to authentication
    if (error.response?.status === 401 || error.response?.status === 403) {
      navigate("/login");
    }

    throw new Error(error.response?.data?.message || "Error fetching profile");
  }
};