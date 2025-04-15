import React from 'react';
import { useSelector } from 'react-redux';
import { selectItineraryByUserId } from '../../slices/itinerary/itinerarySlice';
import { selectUserId } from '../../slices/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const UserTrip = () => {
  const userId = useSelector(selectUserId); // Get the current user ID from authSlice
  const userItineraries = useSelector(selectItineraryByUserId(userId));
  const navigate = useNavigate(); // Initialize the useNavigate hook

  return (
    <div className="flex-1 w-full bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Your trips</h2>
        <button onClick={() => navigate('/PrePlanningItinerary')}
         className="bg-gray-200 text-sm text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
          + Plan new trip
        </button>
      </div>
      {userItineraries.length > 0 ? (
        <ul className="space-y-2">
          {userItineraries.map((itinerary) => (
            <li
              key={itinerary.id}
              className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold">{itinerary.description}</h3>
              <p className="text-sm text-gray-600">
                {itinerary.start} - {itinerary.end}
              </p>
              <p className="text-sm text-gray-600">Days: {itinerary.days}</p>
              <p className="text-sm text-gray-600">Budget: ${itinerary.budget}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">
          You don’t have any trip plans yet.{' '}
          <span onClick={() => navigate('/PrePlanningItinerary')} 
          className="text-red-500 cursor-pointer">
            Plan a new trip.
            </span>
        </p>
      )}
    </div>
  );
};

export default UserTrip;