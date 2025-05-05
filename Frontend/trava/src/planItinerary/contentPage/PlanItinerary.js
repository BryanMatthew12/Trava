import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlaces, appendPlaces, clearPlaces, selectPlaces } from '../../slices/places/placeSlice';
import { useLocation } from 'react-router-dom';
import { fetchPlaces } from '../../api/places/places'; // Import fetchPlaces
import Select from 'react-select'; // Import React-Select

const PlanItinerary = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const places = useSelector(selectPlaces); // Get places from Redux store
  const [page, setPage] = useState(1); // State to manage pagination
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  const {
    source,
    itineraryId,
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
  const [selectedPlaces, setSelectedPlaces] = useState(
    Array.from({ length: tripDuration }, () => null) // Default: no place selected for each day
  );

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

  const handleSelectPlace = (selectedOption, dayIndex) => {
    const updatedSelectedPlaces = [...selectedPlaces];
    updatedSelectedPlaces[dayIndex] = selectedOption; // Store the selected place for the specific day
    setSelectedPlaces(updatedSelectedPlaces);
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
                {selectedPlaces[index] && (
                  <div className="mb-4 p-4 border border-gray-300 rounded-lg flex items-center">
                    <div className="flex-grow">
                      <h4 className="font-semibold">{selectedPlaces[index].label}</h4>
                      <p className="text-gray-500">{selectedPlaces[index].description}</p>
                    </div>
                  </div>
                )}
                <div className="mb-2">
                  <label className="block text-gray-500 font-medium">Add a place</label>
                  <Select
                    options={places.map((place) => ({
                      value: place.id,
                      label: place.name,
                      description: place.description,
                    }))}
                    onChange={(selectedOption) => handleSelectPlace(selectedOption, index)}
                    placeholder="Search for a place"
                    className="text-gray-700"
                    onMenuScrollToBottom={handleNextPage} // Trigger handleNextPage when scrolling to the bottom
                    isLoading={isLoading} // Show loading indicator while fetching
                    menuPortalTarget={document.body} // Render dropdown outside the container
                    menuPlacement="auto" // Automatically place the dropdown
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        maxHeight: '200px', // Set max height for the dropdown
                        overflowY: 'auto', // Enable vertical scrolling
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: '200px', // Set max height for the dropdown list
                        overflowY: 'auto', // Enable vertical scrolling
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
  );
};

export default PlanItinerary;