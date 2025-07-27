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
    <div className="px-2 w-full max-w-full sm:max-w-3xl mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2">Explore Threads</h1>
      <p className="text-center text-gray-600 mb-4 md:mb-6 text-sm sm:text-base">
        See threads made by other travellers
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6 md:mb-8 gap-2 sm:gap-4">
        <input
          type="text"
          placeholder="Explore threads to get more itinerary from other users"
          className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-96 outline-none text-base"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      {/* <nav
        className="flex flex-row gap-3 sm:gap-4 justify-start sm:justify-center text-xs sm:text-sm md:text-base py-2 px-1 sm:px-2 bg-white shadow overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
      </nav> */}
        {/* ...menu items... */}
    </div>
  );
};

export default Header;