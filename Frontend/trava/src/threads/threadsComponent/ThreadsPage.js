import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config'; // Import the base URL

const ThreadsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itineraries_id = queryParams.get('source'); // Get the source (itineraries_id) from the query parameters

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/v1/itineraries/${itineraries_id}`);
        setItinerary(response.data); // Assuming the API returns the itinerary details
      } catch (error) {
        console.error('Error fetching itinerary:', error);
      } finally {
        setLoading(false);
      }
    };

    if (itineraries_id) {
      fetchItinerary();
    }
  }, [itineraries_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!itinerary) {
    return <div>Itinerary not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{itinerary.title}</h1>
      <img
        src={itinerary.picture}
        alt={itinerary.title}
        className="w-full h-64 object-cover mb-4"
      />
      <p className="text-gray-700 mb-4">{itinerary.description}</p>
      <p className="text-sm text-gray-500">Budget: ${itinerary.budget}</p>
      <p className="text-sm text-gray-500">Start Date: {itinerary.start_date}</p>
      <p className="text-sm text-gray-500">End Date: {itinerary.end_date}</p>
    </div>
  );
};

export default ThreadsPage;