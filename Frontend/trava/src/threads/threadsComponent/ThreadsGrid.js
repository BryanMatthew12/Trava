import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { viewThread } from "../../api/thread/viewThread";

const ThreadsGrid = ({ guides, loading }) => {
  const navigate = useNavigate();

  const handleThreadClick = async (guide) => {
    try {
      await viewThread(guide.thread_id);
    } catch (e) {
      // Optional: handle error
    }
    navigate(
      `/threads/details?threads_id=${guide.thread_id}&itineraries_id=${guide.itinerary_id}`
    );
  };

  if (!guides || guides.length === 0) {
    return (
      <div className="text-center col-span-full">No threads available.</div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {guides.map((guide) => (
        <div
          key={guide.thread_id}
          className="border rounded-lg overflow-hidden shadow-md cursor-pointer"
          onClick={() => handleThreadClick(guide)}
        >
          <img
            src={guide.thread_picture}
            alt={guide.itinerary.itinerary_name}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-bold mb-1">
              {guide.itinerary.itinerary_name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {guide.thread_content}
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center space-x-2 ml-auto">
                <span>👁 {guide.views}</span>
                <span>❤️ {guide.likes}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      {loading && <div className="text-center col-span-full">Loading...</div>}
    </div>
  );
};

export default ThreadsGrid;
