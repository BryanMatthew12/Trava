import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config";

export const updateProfile = async (id, { username, imageFile }) => {
  try {
    const token = Cookies.get("token");

    let data, headers;
    if (imageFile) {
      // Jika ada gambar, pakai FormData
      data = new FormData();
      data.append("username", username);
      data.append("user_picture", imageFile);
      headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };
    } else {
      // Jika hanya username, pakai JSON
      data = { username };
      headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    }

    const response = await axios.patch(
      `${BASE_URL}/v1/users/${id}`,
      data,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating profile:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Error updating profile");
  }
};