import React, {useEffect, useState} from 'react';
import { getItineraryDetails } from '../../api/itinerary/getItineraryDetails';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { deleteItinerary } from '../../api/itinerary/deleteItinerary';
import patchItinerary from '../../api/itinerary/patchItinerary';

const ItineraryDetails = () => {

    const [itineraryData, setItineraryData] = useState(null);
    const [searchParams] = useSearchParams();
    const itineraryId = searchParams.get('params'); // Get 'params' from URL
     const navigate = useNavigate();

    useEffect(() => {
        const fetchItineraryDetails = async () => {
          const source = searchParams.get('source'); // Get 'source' from URL
          const params = searchParams.get('params'); // Get 'params' from URL
      
          if (source === 'preview' && params) {
            try {
              const data = await getItineraryDetails(params); // Fetch itinerary details
              setItineraryData(data); // Set the fetched data to state
            } catch (error) {
              console.error('Error fetching itinerary details:', error.message);
            }
          }
        };
      
        fetchItineraryDetails();
      }, [searchParams]);

        const handleDelete = async () => {
          try {
            const response = await deleteItinerary(itineraryId, navigate);
            if (response) {
              return
            } else {
              console.error('Failed to delete itinerary:', response.message);
            }
          } catch (error) {
            console.error('Error deleting itinerary:', error.message);
          }
        }

  if (!itineraryData) {
    return <div>Loading...</div>; // Show a loading state if data is not available
  }

  // Group places by day_id and sort by day_id and visit_order
  const groupedPlaces = itineraryData.places.reduce((acc, place) => {
    if (!acc[place.day_id]) {
      acc[place.day_id] = [];
    }
    acc[place.day_id].push(place);
    acc[place.day_id].sort((a, b) => a.visit_order - b.visit_order); // Sort by visit_order
    return acc;
  }, {});

  // Sort day_ids in ascending order
  const sortedDayIds = Object.keys(groupedPlaces).sort((a, b) => a - b);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{itineraryData.destination_name}</h2>
      <p className="text-gray-600 mb-2">
        <strong>Start Date:</strong> {new Date(itineraryData.start_date).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>End Date:</strong> {new Date(itineraryData.end_date).toLocaleDateString()}
      </p>

      {sortedDayIds.map((dayId, index) => (
        <div key={dayId} className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Day {index + 1}</h3>
          {groupedPlaces[dayId].map((place) => (
            <div key={place.place_id} className="mb-4 p-4 border border-gray-300 rounded-lg">
              <div className="flex items-center">
                <img
                  src={place.place_image || 'https://via.placeholder.com/100'}
                  alt={place.place_name}
                  className="w-20 h-20 object-cover rounded-lg mr-4"
                />
                <div>
                  <h4 className="font-semibold text-lg">{place.place_name}</h4>
                  <p className="text-gray-500">{place.place_description}</p>
                  <p className="text-gray-600">
                    <strong>Rating:</strong> {place.place_rating || 'N/A'} / 5
                  </p>
                  <p className="text-gray-600">
                    <strong>Estimated Price:</strong> {place.place_est_price ? `Rp. ${place.place_est_price}` : 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <strong>Visit Order:</strong> {place.visit_order}
                  </p>
                </div>
              </div>
            </div>
            
          ))}
        </div>
        
      ))}
      <div className="p-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleDelete} // Call handleSaveItinerary on click
        >
          Delete
        </button>
      </div>
    </div>
    
  );
};

export default ItineraryDetails;