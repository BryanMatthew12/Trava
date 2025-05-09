import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie untuk akses token
import { BASE_URL } from '../../config';

/**
 * Fungsi untuk mengambil itinerary berdasarkan user_id.
 * @param {number} userId - ID user untuk mengambil itinerary.
 * @returns {Promise<object[]>} - Respons dari server berupa daftar itinerary.
 */
export const showPlanItinerary = async (itineraryId) => {
  try {
    const token = Cookies.get('token'); // Ambil token dari cookies

    // Lakukan permintaan GET ke API
    const response = await axios.get(`${BASE_URL}/v1/itinerary-destinations/${itineraryId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Sertakan token untuk otentikasi
      },
    });

    if (response.data) {
      return response.data; // Kembalikan data dari respons server
    } else {
      throw new Error('Error: No data received from the API');
    }
  } catch (error) {
    console.error('Error fetching user itineraries:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error fetching user itineraries');
  }
};
// Route::get('/itinerary-destinations/{itinerary_id}', [ItineraryDestinationController::class, 'show']);