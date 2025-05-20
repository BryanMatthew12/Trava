import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../config';

export const deleteThread = async (id) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.delete(
      `${BASE_URL}/v1/threads/${id}`,
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
    console.error('Error deleting thread:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error deleting thread');
  }
};