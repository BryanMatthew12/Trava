import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { postPrePlanning } from '../api/itinerary/postPrePlanning';
import { useSelector } from 'react-redux';
import { selectDestinations } from '../slices/destination/destinationSlice';
import Select from 'react-select';

const PrePlanningItinerary = () => {
  const destinations = useSelector(selectDestinations);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [budget, setBudget] = useState(null);
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const mappedDestinations = destinations.map((destination) => ({
    value: destination.id,
    label: destination.name,
  }));

  const handleDestinationChange = (selectedOption) => {
    setDestination(selectedOption?.label || '');
    setDestinationId(selectedOption?.value || ''); 
  }

  const handleContinue = async () => {
    if (!destination || !startDate || !endDate || !budget || !description || !title) {
      alert('Please fill in all fields before continuing.');
      return;
    }
  
    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
    
    try {
      const itineraryId = await postPrePlanning(
        title,
        formattedStartDate,
        formattedEndDate,
        budget,
        description,
        destination,
        destinationId,
        navigate
      );
    } catch (error) {
      // console.error('Error posting itinerary:', error);
      alert('There was an error submitting your itinerary. Please try again.');
    } 
    // finally {
    //   if (itineraryId) {
    //     navigate(`/PlanningItinerary?source=header&id=${itineraryId}`);
    //   }
    // }
  };
  

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white pt-10">
      <h1 className="text-2xl font-bold mb-6">Plan Your Trip</h1>
      
      {/* Destination Input */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Select
            id="province-select"
            options={mappedDestinations}
            value={mappedDestinations.find(
              (option) => option.label === destination
            )}
            onChange={handleDestinationChange}
            className="w-full"
            placeholder="Select a province"
          />
        </div>
      </div>

      <div className="mb-6 w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
        <input
          type="text"
          placeholder="Input your budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6 w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <input
          type="text"
          placeholder="Input your description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6 w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          placeholder="Input your title"
          value={title}
          onChange={(e) => {
            // Hanya izinkan karakter alphanumeric dan spasi
            const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
            setTitle(value);
            console.log(value);
          }}
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

export default PrePlanningItinerary;