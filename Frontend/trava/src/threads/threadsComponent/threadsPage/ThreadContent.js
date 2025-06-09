import React, { useState, useEffect } from 'react';
import { likeThread } from '../../../api/thread/likeThread';
import { getThreadById } from '../../../api/thread/getThreadById';
import { getItineraryDetails } from '../../../api/itinerary/getItineraryDetails';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../../slices/auth/authSlice';
import { deleteThread } from '../../../api/thread/deleteThread';

const ThreadContent = () => {
  const [searchParams] = useSearchParams();
  const threads_id = searchParams.get('threads_id');
  const itineraries_id = searchParams.get('itineraries_id');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [thread, setThread] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = useSelector(selectUserId); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const threadRes = await getThreadById(threads_id);
        const threadData = Array.isArray(threadRes?.data) ? threadRes.data[0] : threadRes?.data;
        setThread(threadData);
        setLiked(!!threadData?.liked);
        setLikes(threadData?.likes ?? 0);

        const itineraryRes = await getItineraryDetails(itineraries_id);
        setItinerary(itineraryRes);
      } catch (error) {
        setThread(null);
        setItinerary(null);
      } finally {
        setLoading(false);
      }
    };
    if (threads_id && itineraries_id) fetchData();
  }, [threads_id, itineraries_id]);

  const handleLike = async () => {
    await likeThread(threads_id);
    const data = await getThreadById(threads_id);
    const threadData = Array.isArray(data?.data) ? data.data[0] : data?.data;
    setLiked(!!threadData?.liked);
    setLikes(threadData?.likes ?? 0);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this thread?')) {
      try {
        await deleteThread(thread.thread_id);
        alert('Thread deleted!');
        navigate('/threads');
      } catch (err) {
        alert('Failed to delete thread');
      }
    }
  };

  // Tambahkan fungsi getImageSrc
  function getImageSrc(image) {
    if (!image) return 'https://via.placeholder.com/80?text=No+Image';
    return image;
  }

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

  // Group places by day_id
  const groupedPlaces = {};
  if (Array.isArray(itinerary.places)) {
    itinerary.places.forEach((place) => {
      if (!groupedPlaces[place.day_id]) groupedPlaces[place.day_id] = [];
      groupedPlaces[place.day_id].push(place);
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="relative">
          <img
            src={thread.thread_picture || "https://via.placeholder.com/600x300?text=No+Image"}
            alt={itinerary.destination_name}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="flex justify-end bg-gray-50 p-4 items-center gap-4">
          {/* Tampilkan tombol delete jika userId sama dengan thread.user_id */}
          {thread?.user_id?.toString() === userId?.toString() && (
            <button
              onClick={handleDelete}
              className="px-3 py-1 rounded-full font-semibold bg-red-500 text-white hover:bg-red-600 transition"
            >
              Delete Thread
            </button>
          )}
          <button
            onClick={handleLike}
            className={`px-3 py-1 rounded-full font-semibold transition ${
              liked
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-200 text-gray-700 hover:bg-red-100'
            }`}
          >
            {liked ? 'Unlike ❤️' : 'Like 🤍'}
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-500">Likes: {likes}</p>
            <p className="text-sm text-gray-500">Views: {thread.views}</p>
          </div>
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{thread?.itinerary?.itinerary_name || "-"}</h1>
          <h1 className="text-xl font-semibold text-gray-800 mb-4">{itinerary.destination_name}</h1>
          <p className="text-gray-700 text-lg mb-6">{itinerary.itinerary_description || "No description."}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="text-lg font-semibold text-gray-800">{itinerary.start_date}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">End Date</p>
              <p className="text-lg font-semibold text-gray-800">{itinerary.end_date}</p>
            </div>
          </div>
          {/* PLACES VIEW */}
          <div className="bg-gray-50 rounded-lg p-4 mt-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Itinerary Places</h2>
            {Object.keys(groupedPlaces).length === 0 ? (
              <div className="text-gray-400 italic">No places available.</div>
            ) : (
              Object.keys(groupedPlaces)
                .sort((a, b) => a - b)
                .map((dayId, index) => (
                  <div key={dayId} className="mb-6">
                    <div className="flex items-center mb-2">
                      <span className="text-lg font-bold text-gray-800 mr-2">Day {index + 1}</span>
                      <span className="text-blue-400 text-xl">▼</span>
                    </div>
                    {groupedPlaces[dayId]
                      .sort((a, b) => a.visit_order - b.visit_order)
                      .map((place, idx) => (
                        <div
                          key={place.place_id + '-' + place.visit_order}
                          className="mb-4 p-4 border border-gray-200 rounded-lg flex items-start bg-white shadow-sm hover:shadow-md transition"
                        >
                          <img
                            src={getImageSrc(place.place_picture || place.place_image)}
                            alt={place.place_name}
                            className="w-16 h-16 object-cover rounded-lg mr-4 border"
                          />
                          <div className="flex-grow">
                            <div className="font-bold text-lg text-gray-800 mb-1">{place.place_name}</div>
                            {place.place_description && (
                              <div className="text-gray-600 mb-1">{place.place_description}</div>
                            )}
                            <div className="flex flex-wrap gap-4 text-sm mt-1">
                              <div>
                                <span className="font-semibold text-gray-700">Rating:</span>{" "}
                                {place.place_rating || "N/A"} / 5
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">Estimated Price:</span>{" "}
                                {place.place_est_price ? `Rp. ${place.place_est_price}` : "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadContent;