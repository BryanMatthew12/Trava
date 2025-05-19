import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserId } from '../../slices/auth/authSlice';
import { getUserItineraries } from '../../api/itinerary/showItinerary';
import { showPlanItinerary } from '../../api/itinerary/showPlanItinerary';
import { setItineraries, selectItineraries } from '../../slices/itinerary/showItinerarySlice';
import { useNavigate } from 'react-router-dom';

const UserTrip = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId); // Ambil user_id dari Redux state
  const itineraries = useSelector(selectItineraries); // Ambil daftar itinerary dari Redux state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserItineraries(userId); // Ambil data itinerary berdasarkan user_id
        console.log(data);
        dispatch(setItineraries(data)); // Simpan data ke Redux state
      } catch (error) {
        console.error('Error fetching user itineraries:', error.message);
      }
    };

    fetchData();
  }, [userId, dispatch]);

  const handleClick = (itinerary) => {
    navigate(`/PlanningItinerary?source=edit&params=${itinerary.id}`);
  }

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
      {itineraries.length > 0 ? (
        <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '200px' }}>
          {[...itineraries].reverse().map((itinerary) => (
            <div
              key={itinerary.id}
              className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
              onClick={() =>
                handleClick(itinerary) // Panggil fungsi handleClick saat item diklik
              }
            >
              <h3 className="font-semibold">{itinerary.destination_name} Trip</h3>
              <p className="text-sm text-gray-600">
                {itinerary.start_date} - {itinerary.end_date}
              </p>
              <p className="text-sm text-gray-600">{itinerary.itinerary_description}</p>
            </div>
          ))}
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