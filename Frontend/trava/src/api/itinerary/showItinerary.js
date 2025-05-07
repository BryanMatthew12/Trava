import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to access cookies
import { BASE_URL } from '../../config';

export const showItinerary = async (id) => {
  try {
    const token = Cookies.get('token');

    // Make the API request with the token in the headers
    const response = await axios.get(`${BASE_URL}/v1/itinerary-destination?itinerary_id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token as a Bearer token
      },
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error('Error: No data received from the API');
    }
  } catch (error) {
    console.error('Error fetching destinations:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error fetching destinations');
  }
};