import React, { useState } from 'react';

const Header = ({ onSearch }) => {
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
      setTimeout(() => {
        onSearch(value); // Pass the search query to the parent component
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
          placeholder="Explore threads to get more itinerary from other users"
          className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md outline-none"
          value={searchTerm}
          onChange={handleInputChange} // Trigger search on input change
        />
      </div>
    </>
  );
};

export default Header;