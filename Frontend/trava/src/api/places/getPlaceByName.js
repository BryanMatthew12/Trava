import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to access cookies
import { BASE_URL } from '../../config';

export const getPlaceByName = async (name) => {
  try {
    const token = Cookies.get('token');

    const response = await axios.get(`${BASE_URL}/v1/places?name=${name}`, {
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

export const getPlacesByDestinationId = async (destinationId) => {
  try {
    const response = await axios.get(`${BASE_URL}/v1/places?destination_id=${destinationId}`);
    const places = response.data; // This will be all places for that destination
    const placeNames = places.map(place => place.place_name);

    return placeNames;
  } catch (error) {
    console.error('Error fetching places by destination ID:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error fetching places by destination ID');
  }
};