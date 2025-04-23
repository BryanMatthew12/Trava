import React from "react";
import { Link } from "react-router-dom";

const ThreadsGrid = ({ guides, loading }) => {
  if (!guides || guides.length === 0) {
    return (
      <div className="text-center col-span-full">No threads available.</div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {guides.map((guide) => (
        <Link
          key={guide.thread_id}
          to={`/threads/details?threads_id=${guide.thread_id}&itineraries_id=${guide.itinerary_id}`} // Pass threads_id and itineraries_id as query parameters
        >
          <div className="border rounded-lg overflow-hidden shadow-md">
            <img
              src={guide.thread_picture}
              alt={guide.thread_title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold mb-1">{guide.thread_title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {guide.thread_content}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                {/* <span>{guide.author || 'Unknown Author'}</span> */}
                <div className="flex items-center space-x-2 ml-auto">
                  <span>👁 {guide.views}</span>
                  <span>❤️ {guide.likes}</span>
                </div>
              </div>d
            </div>
          </div>
        </Link>
      ))}
      {loading && <div className="text-center col-span-full">Loading...</div>}
    </div>
  );
};

export default ThreadsGrid;
