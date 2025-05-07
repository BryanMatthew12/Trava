import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlaces, appendPlaces, clearPlaces, selectPlaces } from '../../slices/places/placeSlice';
import { useLocation } from 'react-router-dom';
import { fetchPlaces } from '../../api/places/places'; // Import fetchPlaces
import { editBudget } from '../../api/itinerary/editBudget';
import Select from 'react-select'; // Import React-Select
import { useSearchParams } from 'react-router-dom';
import { fetchDayId } from '../../api/dayId/fetchDayId'; // Import fetchDayId
import { useNavigate } from 'react-router-dom';
import { postItinerary } from '../../api/itinerary/postItinerary';
import { fetchCoord } from '../../api/mapCoord/fetchCoord'; // Import fetchCoord

const PlanItinerary = (onPlaceChange) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const places = useSelector(selectPlaces); // Get places from Redux store
  const [dayId, setDayId] = useState([]); // State to store dayId
  const [page, setPage] = useState(1); // State to manage pagination
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal
  const [currentBudget, setCurrentBudget] = useState(location.state?.budget || 0); // State untuk budget
  const itineraryId = searchParams.get('params'); // Get itineraryId from URL params
  const [destinations, setDestinations] = useState([]); // State to store destinations
  const [selectPlace, setSelectPlace] = useState(); // State to store selected places
  const [activePlaceId, setActivePlaceId] = useState(null); // State to track active place ID
  
  const {
    start,
    end,
    budget,
    desc,
    destination,
    destinationId,
  } = location.state || {}; // Destructure the state object

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

  // State to store selected places for each day
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  // Fetch places based on destinationId when component mounts
  useEffect(() => {
    const fetchPlacesByDestination = async () => {
      if (destinationId) {
        try {
          const placesData = await fetchPlaces(destinationId, 1); // Fetch initial places (page 1)
          dispatch(setPlaces(placesData)); // Dispatch places to Redux store
        } catch (error) {
          console.error('Error fetching places by destinationId:', error.message);
          dispatch(clearPlaces()); // Clear places if there's an error
        }
      }
    };

    fetchPlacesByDestination();
  }, [destinationId, dispatch]);

  useEffect(() => {
    const fetchDayData = async () => {
      try {
        const dayData = await fetchDayId(itineraryId); // Fetch the day data
        const dayIds = dayData.map((day) => day.day_id); // Extract all day_id values
        setDayId(dayIds); // Set the dayId state with the extracted day_id values
        console.log('Fetched day IDs:', dayIds);
      } catch (error) {
        console.error('Error fetching day data:', error.message);
      }
    };

    fetchDayData();
  }, [itineraryId]);
  
    useEffect(() => {
      const getCoordinates = async () => {
        try {
          const destinations = await fetchCoord(selectPlace);
          const coordinates = destinations?.data;
  
          if (coordinates) {
            const { latitude, longitude } = coordinates;
            onPlaceChange(latitude, longitude); // pass to callback
          }
        } catch (error) {
          console.error("Failed to fetch coord", error.message);
        }
      };
  
      getCoordinates();
    }, [selectPlace, onPlaceChange]);

  // Handle loading more places when scrolling to the bottom
  const handleNextPage = async () => {
    if (isLoading) return; // Prevent multiple requests if already loading
    setIsLoading(true); // Set loading state to true

    try {
      const nextPage = page + 1; // Increment the page
      const newPlaces = await fetchPlaces(destinationId, nextPage); // Fetch places for the next page
      dispatch(appendPlaces(newPlaces)); // Append new places to Redux store
      setPage(nextPage); // Update the current page
    } catch (error) {
      console.error('Error loading more places:', error.message);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const toggleDayVisibility = (index) => {
    setVisibleDays((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const handleSelectPlace = (selectedOption, dayId) => {
    setSelectPlace(selectedOption.label);

    setDestinations((prevDestinations) => {
      const filteredDestinations = prevDestinations.filter(
        (destination) => !(destination.place_id === selectedOption.value && destination.day_id === dayId)
      );

      const visitOrder = filteredDestinations.filter((destination) => destination.day_id === dayId).length + 1;

      const newDestination = {
        place_id: selectedOption.value,
        day_id: dayId,
        visit_order: visitOrder,
      };

      return [...filteredDestinations, newDestination];
    });
  };

  const handleDeletePlace = (placeId, dayId) => {
    setDestinations((prevDestinations) =>
      prevDestinations.filter(
        (destination) => !(destination.place_id === placeId && destination.day_id === dayId)
      )
    );
  };

  const handleSaveItinerary = async () => {
    try {
      const response = await postItinerary(itineraryId, destinations, navigate);

      if (response) {
        return
      } else {
        console.error('Failed to save itinerary:', response.message);
      }
    } catch (error) {
      console.error('Error saving itinerary:', error.message);
      alert('An error occurred while saving the itinerary.');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const setBudget = (newBudget) => {
    setCurrentBudget(newBudget); // Perbarui state `currentBudget`
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="relative bg-cover bg-center h-64" style={{ backgroundImage: "url('https://via.placeholder.com/1500x500')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-white p-6">
          <h1 className="text-4xl font-bold">{destination || 'Trip Destination'}</h1>
          <p className="text-lg mt-2">{start} - {end}</p>
        </div>
      </div>

      {/* Notes Section */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <div className="bg-white shadow-md rounded-lg p-4">
          <textarea
            className="w-full h-24 border border-gray-300 rounded-lg p-2"
            placeholder="Write or paste anything here: how to get around, tips and tricks"
          ></textarea>
        </div>
      </div>

      {/* Budgeting Section */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Budgeting</h2>
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-xl font-bold">Rp. {budget || '0.00'}</p>
          <button className="text-blue-500 mt-2 hover:underline" onClick={openModal}>Edit Budget</button>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-gray-700 font-medium mb-2">Itinerary</h3>
          {dayId.map((id, index) => (
            <div key={id} className="mb-4 border border-gray-300 rounded-lg p-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleDayVisibility(index)}
              >
                <h3 className="text-lg font-semibold">
                  {new Date(startDate.getTime() + index * 86400000).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <span className="text-blue-500">
                  {visibleDays[index] ? '▼' : '▲'}
                </span>
              </div>
              {visibleDays[index] && (
                <div className="mt-2">
                  {/* Render selected places */}
                  {destinations
                    .filter((destination) => destination.day_id === id)
                    .map((destination, idx) => {
                      const place = places.find((place) => place.id === destination.place_id);

                      return (
                        <div
                          key={idx}
                          className={`mb-2 p-2 border rounded-lg flex items-center cursor-pointer ${
                            activePlaceId === destination.place_id
                              ? 'bg-blue-100 scale-105' // Highlight and enlarge the active component
                              : 'hover:bg-gray-100'
                          } transition-transform duration-200`}
                          onClick={() => {
                            setSelectPlace(place?.name); // Set selectPlace to the name of the place
                            setActivePlaceId(destination.place_id); // Set the active place ID
                          }}
                        >
                          <div className="flex-grow">
                            <h4 className="font-semibold">{place?.name || 'Unknown Place'}</h4>
                            <p className="text-gray-500">{place?.description || 'No description available'}</p>
                          </div>
                          <button
                            className="text-red-500 hover:text-red-700 ml-4"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering the parent onClick
                              handleDeletePlace(destination.place_id, id); // Call handleDeletePlace
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  <div className="mb-2">
                    <label className="block text-gray-500 font-medium">Add a place</label>
                    <Select
                      options={places.map((place) => ({
                        value: place.id,
                        label: place.name,
                        description: place.description,
                      }))}
                      onChange={(selectedOption) => handleSelectPlace(selectedOption, id)} // Pass the correct dayId (id)
                      placeholder="Search for a place"
                      className="text-gray-700"
                      onMenuScrollToBottom={handleNextPage}
                      isLoading={isLoading}
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
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSaveItinerary} // Call handleSaveItinerary on click
        >
          Save
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Budget</h2>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              value={currentBudget}
              onChange={(e) => setCurrentBudget(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={async () => {
                  try {
                    const data = await editBudget(itineraryId, currentBudget); // Panggil API untuk memperbarui budget
                    setCurrentBudget(data.budget); // Perbarui state budget dengan respons dari server
                    closeModal(); // Tutup modal
                  } catch (error) {
                    console.error('Failed to update budget:', error.message);
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanItinerary;