import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config";

export const editPlaceByName = async (name) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.get(
      `${BASE_URL}/v1/places/${encodeURIComponent(name)}`,
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