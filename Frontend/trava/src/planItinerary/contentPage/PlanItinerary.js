import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlaces, appendPlaces, clearPlaces, selectPlaces } from '../../slices/places/placeSlice';
import { useLocation } from 'react-router-dom';
import { fetchPlaces } from '../../api/places/places'; // Import fetchPlaces
import { editBudget } from '../../api/itinerary/editBudget';
import Select from 'react-select'; // Import React-Select
import { useSearchParams } from 'react-router-dom';

const PlanItinerary = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const places = useSelector(selectPlaces); // Get places from Redux store
  const [page, setPage] = useState(1); // State to manage pagination
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
<<<<<<< HEAD
  const itineraryid = searchParams.get("params");

  console.log("itineraryid", itineraryid);

=======
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal
  const [currentBudget, setCurrentBudget] = useState(location.state?.budget || 0); // State untuk budget
  
>>>>>>> 5f9be20869aafb059645f6261f4002fdac5cb998
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
  const [selectedPlaces, setSelectedPlaces] = useState(
    Array.from({ length: tripDuration }, () => []) // Default: empty array for each day
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
    setSelectedPlaces((prev) => {
      const updatedPlaces = [...prev];
      const newPlace = {
        id: selectedOption.value,
        label: selectedOption.label,
        description: selectedOption.description,
      };
      updatedPlaces[dayIndex] = [...updatedPlaces[dayIndex], newPlace]; // Add new place to the specific day
      return updatedPlaces;
    });
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
                  {selectedPlaces[index] && selectedPlaces[index].map((place, idx) => (
                    <div key={idx} className="mb-2 p-2 border border-gray-300 rounded-lg flex items-center">
                      <div className="flex-grow">
                        <h4 className="font-semibold">{place.label}</h4>
                        <p className="text-gray-500">{place.description}</p>
                      </div>
                    </div>
                  ))}
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