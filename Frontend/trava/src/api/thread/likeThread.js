import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to access cookies
import { BASE_URL } from '../../config';

export const likeThread = async (id) => {
  try {
    const token = Cookies.get('token');

    // Make the API request with the token in the headers
    const response = await axios.post(
      `${BASE_URL}/v1/threads/${id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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