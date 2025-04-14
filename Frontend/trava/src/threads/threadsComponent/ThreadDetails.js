import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config';

const ThreadDetails = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const threads_id = queryParams.get('threads_id'); // Extract threads_id from the query parameter
  const itineraries_id = queryParams.get('itineraries_id'); // Extract itineraries_id from the query parameter

  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreadDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/v1/itineraries/${itineraries_id}`);
        setThread(response.data); // Assuming the API returns the thread details
      } catch (error) {
        console.error('Error fetching thread details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (itineraries_id) {
      fetchThreadDetails();
    } else {
      console.error('No itineraries_id provided.');
    }
  }, [itineraries_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!thread) {
    return <div>Thread not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>
      <img
        src={thread.picture}
        alt={thread.title}
        className="w-full h-64 object-cover mb-4"
      />
      <p className="text-gray-700 mb-4">{thread.description}</p>
      <p className="text-sm text-gray-500">Author: {thread.author || 'Unknown'}</p>
    </div>
  );
};

export default ThreadDetails;