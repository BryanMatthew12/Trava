import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const PlanItinerary = () => {
  const location = useLocation();
  const {
    source,
    itineraryId,
    start,
    end,
    budget,
    desc,
    destination,
  } = location.state || {}; // Destructure the state object

  console.log('Source:', source);
  console.log('Itinerary ID:', itineraryId);
  console.log('Start Date:', start);
  console.log('End Date:', end);
  console.log('Budget:', budget);
  console.log('Description:', desc);
  console.log('Destination:', destination);

  // Calculate the number of days
  const startDate = new Date(start);
  const endDate = new Date(end);
  const tripDuration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start day

  // Generate an array of days
  const days = Array.from({ length: tripDuration }, (_, i) => `Day ${i + 1}`);

  // State to track visibility of each day's details
  const [visibleDays, setVisibleDays] = useState(
    Array.from({ length: tripDuration }, () => true) // Default: all days visible
  );

  const toggleDayVisibility = (index) => {
    setVisibleDays((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  return (
    <div className="flex-grow p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Itinerary Details</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Itinerary Name</label>
        <p className="border border-gray-300 rounded-lg p-2">{destination || 'N/A'}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Start Date</label>
        <p className="border border-gray-300 rounded-lg p-2">{start || 'N/A'}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">End Date</label>
        <p className="border border-gray-300 rounded-lg p-2">{end || 'N/A'}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Budget</label>
        <p className="border border-gray-300 rounded-lg p-2">{budget || 'N/A'}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Description</label>
        <p className="border border-gray-300 rounded-lg p-2">{desc || 'N/A'}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Trip Duration</label>
        <p className="border border-gray-300 rounded-lg p-2">{tripDuration} days</p>
      </div>
      <div className="mb-4">
        <h3 className="text-gray-700 font-medium mb-2">Itinerary</h3>
        {days.map((day, index) => (
          <div key={index} className="mb-4 border border-gray-300 rounded-lg p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleDayVisibility(index)}
            >
              <h3 className="text-lg font-semibold">{new Date(startDate.getTime() + index * 86400000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
              <span className="text-blue-500">
                {visibleDays[index] ? '▼' : '▲'}
              </span>
            </div>
            {visibleDays[index] && (
              <div className="mt-2">
                <div className="mb-2">
                  <label className="block text-gray-500 font-medium">Add a place</label>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-500">📍</span>
                    <input
                      type="text"
                      placeholder="Add a place"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanItinerary;