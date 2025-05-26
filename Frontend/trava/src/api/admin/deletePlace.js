import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config";

export const deletePlace = async (placeId) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.delete(`${BASE_URL}/v1/places/${placeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete place."
    );
  }
};