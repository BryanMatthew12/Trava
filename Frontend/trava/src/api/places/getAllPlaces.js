import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to access cookies
import { BASE_URL } from '../../config';

export const getAllPlaces = async (id) => {
  try {
    const token = Cookies.get('token');

    const response = await axios.get(`${BASE_URL}/v1/places`, {
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