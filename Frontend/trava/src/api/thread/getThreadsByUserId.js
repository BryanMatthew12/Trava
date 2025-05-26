import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../config';

export const getThreadsByUserId = async (userId) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(`${BASE_URL}/v1/threads?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('No data received from the API');
    }
  } catch (error) {
    console.error('Error fetching threads:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error fetching threads');
  }
};