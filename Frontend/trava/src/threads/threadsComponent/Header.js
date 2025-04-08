import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Function to handle input changes
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const fetchThreads = async () => {
    try {
      const result = await axios.get(
        `http://127.0.0.1:8000/api/v1/threads?title=${searchTerm}` // Replace with your API endpoint
      );
      console.log(result.data);
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  useEffect(() => {
    // Call the fetch function only if searchTerm is not empty
    fetchThreads();
  }, [searchTerm]); // Dependency array ensures this runs when searchTerm changes

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-2">Explore Travel</h1>
      <p className="text-center text-gray-600 mb-6">
        See threads made by other travellers
      </p>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Explore itinerary and destination"
          className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md outline-none"
          onChange={handleInputChange} // Handle input change
        />
      </div>
    </>
  );
};

export default Header;