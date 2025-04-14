import React, { useState } from 'react';

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null); 

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);


    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }


    setTypingTimeout(
      setTimeout(() => {
        onSearch(value);
      }, 500)
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
          onChange={handleInputChange}
        />
      </div>
    </>
  );
};

export default Header;