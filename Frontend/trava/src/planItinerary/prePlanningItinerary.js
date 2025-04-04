import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlanningItinerary = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!destination || !startDate || !endDate) {
      alert('Please fill in all fields before continuing.');
      return;
    }
    navigate('/PlanningItinerary');
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white pt-10">
      <h1 className="text-2xl font-bold mb-6">Plan Your Trip</h1>
      
      {/* Destination Input */}
      <div className="mb-6 w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Plan Your Trip</label>
        <input
          type="text"
          placeholder="Where To Go?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Date Inputs */}
      <div className="flex justify-between w-full max-w-md mb-6">
        <div className="flex flex-col items-start">
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-40 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-40 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Continue Button */}
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
};

export default PlanningItinerary;