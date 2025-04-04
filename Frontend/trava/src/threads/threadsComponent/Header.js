import React from 'react';

const Header = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-2">Explore Travel</h1>
      <p className="text-center text-gray-600 mb-6">See threads made by other travellers</p>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Explore itinerary and destination"
          className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md outline-none"
        />
      </div>
    </>
  );
};

export default Header;