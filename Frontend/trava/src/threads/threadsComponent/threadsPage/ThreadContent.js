import React from 'react';

const ThreadContent = ({ itinerary, thread }) => {
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
        <div className="flex justify-end bg-gray-50 p-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Likes: {thread.likes}</p>
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