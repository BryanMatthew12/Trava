import React, { useState } from 'react';
import { likeThread } from '../../../api/thread/likeThread';
import { useSearchParams } from 'react-router-dom';

const ThreadContent = ({ itinerary, thread, onLike }) => {
  const [liked, setLiked] = useState(thread.liked || false);
  const [likes, setLikes] = useState(thread.likes);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('threads_id'); // Get 'params' from URL
  const handleLike = async () => {
    const result = await likeThread(id);
    if (result && typeof result.liked === 'boolean') {
      setLiked(result.liked);
      setLikes(result.data.likes);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="relative">
          <img
            src={itinerary.picture}
            alt={itinerary.title}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="flex justify-end bg-gray-50 p-4 items-center gap-4">
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
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{itinerary.title}</h1>
          <p className="text-gray-700 text-lg mb-6">{itinerary.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Budget</p>
              <p className="text-lg font-semibold text-gray-800">${itinerary.budget}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="text-lg font-semibold text-gray-800">{itinerary.start_date}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">End Date</p>
              <p className="text-lg font-semibold text-gray-800">{itinerary.end_date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadContent;