import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie untuk akses token
import { BASE_URL } from "../../config";

/**
 * Fungsi untuk memperbarui budget itinerary.
 * @param {number} itineraryId - ID itinerary yang akan diperbarui.
 * @param {number} newBudget - Nilai budget baru.
 * @returns {Promise<object>} - Respons dari server.
 */
export const editBudget = async (itineraryId, newBudget) => {
  try {
    const token = Cookies.get("token"); // Ambil token dari cookie

    const response = await axios.patch(
      `${BASE_URL}/v1/itineraries/${itineraryId}`, // Gunakan metode PATCH
      {
        budget: newBudget, // Data yang dikirim ke API
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token untuk otentikasi
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Kembalikan respons dari server
  } catch (error) {
    console.error(
      "Error updating budget:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error updating budget"
    );
  }
};