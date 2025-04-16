import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchItineraryById } from '../../api/itinerary/fetchItineraryById';
import { getThreadById } from '../../api/thread/getThreadById';
import ThreadContent from './threadsPage/ThreadContent';

const ThreadsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const threads_id = queryParams.get('threads_id');
  const itineraries_id = queryParams.get('itineraries_id');

  const [itinerary, setItinerary] = useState(null);
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itineraryData, threadResponse] = await Promise.all([
          fetchItineraryById(itineraries_id),
          getThreadById(threads_id),
        ]);

        setItinerary(itineraryData);
        setThread(threadResponse.data[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (itineraries_id && threads_id) {
      fetchData();
    }
  }, [itineraries_id, threads_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!itinerary || !thread) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-red-500">Data not found.</div>
      </div>
    );
  }

  return (
    <ThreadContent
    itinerary={itinerary}
    thread = {thread}/>
  );
};

export default ThreadsPage;