import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getItineraryDetails } from '../../api/itinerary/getItineraryDetails';
import { fetchPlaces } from '../../api/places/places.js';
import { setPlaces, selectPlaces } from '../../slices/places/placeSlice';
import Select from 'react-select';
import { patchItinerary } from '../../api/itinerary/patchItinerary.js';
import { useNavigate } from 'react-router-dom';
import { fetchDayId } from '../../api/dayId/fetchDayId'; // Import if not already
import { deleteItinerary } from '../../api/itinerary/deleteItinerary.js'; // Import if not already

const EditItinerary = (onPlaceChange) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const itineraryId = searchParams.get('params');
  const [itineraryData, setItineraryData] = useState(null);
  const option = useSelector(selectPlaces); 
  const [selectPlace, setSelectPlace] = useState();
  const [activePlaceId, setActivePlaceId] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const dispatch = useDispatch();
  const [destinations, setDestinations] = useState([]);
  const [dayId, setDayId] = useState([]); // Store all day ids
  const [visibleDays, setVisibleDays] = useState([]); // Track visibility of each day

  useEffect(() => {
    const fetchItineraryDetails = async () => {
      if (itineraryId) {
        try {
          const data = await getItineraryDetails(itineraryId);
          const { places, ...restWithoutPlaces } = data;
          setItineraryData(restWithoutPlaces);
          setDestinations(data.places);
          console.log('Fetched itinerary data:', data.places);
          if(data) {
            const placesData = await fetchPlaces(data.destination_id, currPage);
            dispatch(setPlaces(placesData));
          }
        } catch (error) {
          console.error('Error fetching itinerary details:', error.message);
        }
      }
    };
    fetchItineraryDetails();
  }, [itineraryId , currPage, dispatch]);

  // Fetch day IDs on mount
  useEffect(() => {
    const fetchDayData = async () => {
      try {
        const dayData = await fetchDayId(itineraryId);
        const dayIds = dayData.map((day) => day.day_id);
        setDayId(dayIds);
        setVisibleDays(Array.from({ length: dayIds.length }, () => true));
      } catch (error) {
        console.error('Error fetching day data:', error.message);
      }
    };
    if (itineraryId) fetchDayData();
  }, [itineraryId]);

  // Set the active place by placeId and optionally set the selected place name
  const handleActivePlace = (placeId, placeName) => {
    console.log('Selected Place ID:', placeId);
    setActivePlaceId(placeId);
    setSelectPlace(placeName);
  };

  // Add new place to destinations
  const handleSelectPlace = (selectedOption, dayId) => {
    setSelectPlace(selectedOption.label);

    setDestinations((prevDestinations) => {
      // Find the max visit_order for this day
      const maxOrder = prevDestinations
        .filter((d) => d.day_id === Number(dayId))
        .reduce((max, d) => Math.max(max, d.visit_order), 0);

      // Prevent duplicate place_id for the same day
      if (prevDestinations.some(d => d.day_id === Number(dayId) && d.place_id === selectedOption.value)) {
        return prevDestinations;
      }

      // Find the full place object for extra info
      const placeObj = option.find((p) => p.id === selectedOption.value);

      const newPlace = {
        day_id: Number(dayId),
        place_id: selectedOption.value,
        place_name: selectedOption.label,
        visit_order: maxOrder + 1,
        place_est_price: placeObj?.price ?? null,
        place_rating: placeObj?.rating ?? null,
        place_image: placeObj?.place_picture ?? null,
        place_description: placeObj?.description ?? null,
      };

      return [...prevDestinations, newPlace];
    });
  };

  // Delete a place from destinations
  const handleDeletePlace = (dayId, placeId, visitOrder) => {
    setDestinations((prevDestinations) =>
      prevDestinations
        .filter(
          (d) =>
            !(
              d.day_id === dayId &&
              d.place_id === placeId &&
              d.visit_order === visitOrder
            )
        )
        // Re-number visit_order for the day after deletion
        .map((d, idx, arr) => {
          if (d.day_id === dayId) {
            const sameDay = arr.filter((x) => x.day_id === dayId);
            sameDay.sort((a, b) => a.visit_order - b.visit_order);
            sameDay.forEach((x, i) => (x.visit_order = i + 1));
          }
          return d;
        })
    );
  };

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

  const handleNextPage = async () => {
    setCurrPage((prevPage) => prevPage + 1);
  };

  const handleEdit = async () => {
    if (!itineraryData || !destinations) return;

    const updatedItinerary = {
      itinerary_id: itineraryData.itinerary_id,
      destination_id: itineraryData.destination_id,
      places: destinations,
    };

    try {
      await patchItinerary(updatedItinerary, navigate);
      alert('Itinerary updated successfully!');
    } catch (error) {
      console.error('Error updating itinerary:', error.message);
      alert('Failed to update itinerary. Please try again.');
    }
  };

  // Toggle day visibility
  const toggleDayVisibility = (index) => {
    setVisibleDays((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  // Validation: all days must have at least one place
  const isAllDaysFilled = dayId.length > 0 && dayId.every(
    (id) => destinations.some((destination) => destination.day_id === id)
  );

  return (
    <div className="p-6">
      {itineraryData ? (
        <>
          <h2 className="text-2xl font-bold mb-4">{itineraryData.destination_name}</h2>
          <p className="text-gray-600 mb-2">
            <strong>Start Date:</strong> {new Date(itineraryData.start_date).toLocaleDateString()}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>End Date:</strong> {new Date(itineraryData.end_date).toLocaleDateString()}
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Description:</strong> {itineraryData.itinerary_description}
          </p>

          {dayId.map((id, index) => {
            const places = destinations.filter((d) => d.day_id === id);
            return (
              <div key={id} className="mb-6 border border-gray-300 rounded-lg p-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleDayVisibility(index)}
                >
                  <h3 className="text-lg font-semibold">
                    Day {index + 1}
                  </h3>
                  <span className="text-blue-500">
                    {visibleDays[index] ? '▼' : '▲'}
                  </span>
                </div>
                {visibleDays[index] && (
                  <div className="mt-2">
                    {places.length === 0 ? (
                      <div className="text-gray-400 italic mb-2">No places selected for this day.</div>
                    ) : (
                      places
                        .sort((a, b) => a.visit_order - b.visit_order)
                        .map((place) => (
                          <div
                          onClick={() => {
  handleActivePlace(place.place_id, place.place_name);
  console.log('Selected Place:', place);
}}

                            key={place.place_id + '-' + place.visit_order}
                            className={`mb-4 p-4 border border-gray-300 rounded-lg flex items-center cursor-pointer transition-transform duration-200 ${
                              activePlaceId === place.place_id
                                ? 'bg-blue-100 scale-105'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <img
                              src={place.place_image || 'https://via.placeholder.com/100'}
                              alt={place.place_name}
                              className="w-20 h-20 object-cover rounded-lg mr-4"
                            />
                            <div className="flex-grow">
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
                            <button
                              className="text-red-500 hover:text-red-700 ml-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePlace(place.day_id, place.place_id, place.visit_order);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        ))
                    )}
                    <Select
                      options={option.map((place) => ({
                        value: place.id,
                        label: place.name,
                        description: place.description,
                      }))}
                      onChange={(selectedOption) => handleSelectPlace(selectedOption, id)}
                      placeholder="Search for a place"
                      className="text-gray-700"
                      onMenuScrollToBottom={handleNextPage}
                      menuPortalTarget={document.body}
                      menuPlacement="auto"
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          maxHeight: '200px',
                          overflowY: 'auto',
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: '200px',
                          overflowY: 'auto',
                        }),
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleEdit}
            disabled={!isAllDaysFilled}
          >
            Save Changes
          </button>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded ml-4"
            onClick={handleDelete}
          >
            Delete Itinerary
          </button>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default EditItinerary;
