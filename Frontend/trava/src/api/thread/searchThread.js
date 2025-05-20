import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../config';

export const searchThread = async (params = {}) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(
      `${BASE_URL}/v1/threads/search`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params, // <-- ini penting!
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};