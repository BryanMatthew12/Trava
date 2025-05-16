import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie untuk mengambil token
import { BASE_URL } from '../../config';

export const exportToThreads = async (id) => {
  try {
    const token = Cookies.get('token'); // Ambil token dari cookie

    if (!token) {
      throw new Error('Token is missing. Please log in again.');
    }

    // Kirim permintaan POST dengan header Authorization
    const response = await axios.post(
      `${BASE_URL}/v1/itinerary-destinations/${id}/export-to-thread`,
      {}, // Body kosong jika tidak ada data tambahan
      {
        headers: {
          Authorization: `Bearer ${token}`, // Tambahkan token ke header
        },
      }
    );

    if (response.data) {
      return response.data;
    } else {
      throw new Error('Error: No data received from the API');
    }
  } catch (error) {
    console.error('Error exporting itinerary to Threads:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error exporting itinerary to Threads');
  }
};