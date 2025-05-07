import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectItineraryDetails, setItineraryDetails } from '../../slices/itinerary/showItinerarySlice';
import { selectUserId } from '../../slices/auth/authSlice';
import { showItinerary } from '../../api/itinerary/showItinerary';
import { useNavigate } from 'react-router-dom';

const UserTrip = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(selectUserId); // Ambil user_id dari Redux state
  const itineraryDetails = useSelector(selectItineraryDetails); // Ambil data itinerary dari Redux state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await showItinerary(userId); // Gunakan userId untuk fetch itinerary
        dispatch(setItineraryDetails(data)); // Simpan data ke Redux state
      } catch (error) {
        console.error('Error fetching itinerary details:', error.message);
      }
    };

    fetchData();
  }, [dispatch, userId]);

  return (
    <div className="flex-1 w-full bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Your trips</h2>
        <button
          onClick={() => navigate('/PrePlanningItinerary')}
          className="bg-gray-200 text-sm text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          + Plan new trip
        </button>
      </div>
      {itineraryDetails.destination_name ? (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
            <h3 className="font-semibold">{itineraryDetails.destination_name}</h3>
            <p className="text-sm text-gray-600">
              {itineraryDetails.start_date} - {itineraryDetails.end_date}
            </p>
            <p className="text-sm text-gray-600">{itineraryDetails.itinerary_description}</p>
          </div>
          <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
            <h4 className="font-semibold">Places:</h4>
            <ul className="list-disc pl-6">
              {itineraryDetails.places.map((place) => (
                <li key={place.place_id} className="text-sm text-gray-600">
                  {place.place_name} (Day {place.day_id}, Visit Order: {place.visit_order})
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">
          You don’t have any trip plans yet.{' '}
          <span
            onClick={() => navigate('/PrePlanningItinerary')}
            className="text-red-500 cursor-pointer"
          >
            Plan a new trip.
          </span>
        </p>
      )}
    </div>
  );
};

export default UserTrip;