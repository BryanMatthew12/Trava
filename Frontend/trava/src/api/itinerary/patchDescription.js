import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../config';

export const patchDescription = async (id, description) => {
  try {
    const token = Cookies.get('token');

    const response = await axios.patch(
      `${BASE_URL}/v1/itineraries/${id}`,
      { itinerary_description: description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      return response.data;
    } else {
      throw new Error('Error: No data received from the API');
    }
  } catch (error) {
    console.error('Error patching description:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error patching description');
  }
};