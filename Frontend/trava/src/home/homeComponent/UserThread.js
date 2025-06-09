import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectName, selectUserId } from '../../slices/auth/authSlice';
import { getThreadsByUserId } from '../../api/thread/getThreadsByUserId';
import { useNavigate } from 'react-router-dom';
import { FaRegCalendarAlt } from "react-icons/fa";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { weekday: 'short', day: '2-digit', month: 'short' };
  return date.toLocaleDateString('en-US', options);
}

const UserThread = () => {
  const userId = useSelector(selectUserId);
  const userName = useSelector(selectName);
  const [userThreads, setUserThreads] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      getThreadsByUserId(userId)
        .then((res) => setUserThreads(res || [])) // ubah dari res?.data ke res
        .catch(() => setUserThreads([]));
      setLoading(false);
    }
  }, [userId]);

  const handleClick = (thread) => {
    navigate(
      `/threads/details?threads_id=${thread.thread_id}&itineraries_id=${thread.itinerary?.itinerary_id}`
    );
  };

  return (
    <div className="flex-1 w-full bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{userName ? `${userName}'s Guides` : 'Your Guides'}</h2>
      </div>
      {userThreads.length > 0 ? (
        <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '200px' }}>
          {[...userThreads].reverse().map((thread) => (
            <div
              key={thread.thread_id}
              className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
              onClick={() => handleClick(thread)}
            >
              <h3 className="font-semibold">{thread.itinerary?.itinerary_name || 'No Title'}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FaRegCalendarAlt className="inline-block mr-1" />
                {formatDate(thread.itinerary?.start_date)} - {formatDate(thread.itinerary?.end_date)}
              </p>
              <p className="text-sm text-gray-600">{thread.itinerary?.itinerary_description}</p>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{thread.likes} Likes</span>
                <span>{thread.views} Views</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          You don’t have any guides yet.{' '}
        </p>
      )}
    </div>
  );
};

export default UserThread;