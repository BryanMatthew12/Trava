import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const PlanningItinerary = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!destination || !startDate || !endDate) {
      alert('Please fill in all fields before continuing.');
      return;
    }
    navigate('/PlanningItinerary?source=header');
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
        {/* Start Date */}
        <div className="flex flex-col items-start relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select Start Date"
              className="mr-1 w-40 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
              <FontAwesomeIcon icon={faCalendarAlt} />
            </span>
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col items-start relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Select End Date"
              className="w-40 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-1"
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
              <FontAwesomeIcon icon={faCalendarAlt} />
            </span>
          </div>
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