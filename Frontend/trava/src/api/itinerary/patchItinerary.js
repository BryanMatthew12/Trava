import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to access cookies
import { BASE_URL } from '../../config';

export const patchItinerary = async (
    updatedData,
    navigate
) => {
  try {
    const token = Cookies.get('token');

    // Make the API request with the token in the headers
    const response = await axios.put(`${BASE_URL}/v1/itinerary-destinations/${updatedData.itinerary_id}`, 
        {
            itinerary_id: updatedData.itinerary_id, // Use "itinerary_id" as expected by the API
            destination_id: updatedData.destination_id, // Use "destination_id" as expected by the API
            destinations: updatedData.places, // Pass the destinations array
        },
        {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token as a Bearer token
      },
    });

    if (response.data) {
        navigate(`/home`); // Navigate to the home page on success
      return response.data;
    } else {
      throw new Error('Error: No data received from the API');
    }
  } catch (error) {
    console.error('Error fetching destinations:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error fetching destinations');
  }
};