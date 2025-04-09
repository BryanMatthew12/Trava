import React, { useState } from 'react';
import axios from 'axios';

const Header = ({ onSearch, token }) => { // Accept the token as a prop
  const [searchTerm, setSearchTerm] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null); // Timeout for debouncing

  // Function to handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear the previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to delay the API call
    setTypingTimeout(
      setTimeout(async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/v1/threads?title=${value}`, // Pass the title as a query parameter
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token, // Use the token here
              },
            }
          );
          onSearch(response.data.data); // Pass the fetched data to the parent component
        } catch (error) {
          console.error('Error fetching threads:', error);
        }
      }, 500) // Delay the API call by 500ms
    );
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-2">Explore Threads</h1>
      <p className="text-center text-gray-600 mb-6">
        See threads made by other travellers
      </p>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Explore threads to get more itinerary from other user"
          className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md outline-none"
          value={searchTerm}
          onChange={handleInputChange} // Trigger search on input change
        />
      </div>
    </>
  );
};

export default Header;