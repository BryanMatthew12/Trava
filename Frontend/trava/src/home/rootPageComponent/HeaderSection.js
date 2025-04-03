import React from 'react';

const HeaderSection = () => {
  return (
    <div className="text-center w-[85%] mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-4xl mb-8 font-bold bg-clip-text">
        Website Slogan
      </h1>
      <h2 className="text-sm sm:text-lg md:text-2xl mb-8 max-w-full md:max-w-3xl font-medium bg-clip-text mx-auto">
        Plan your next adventure with ease using Trava. Create itineraries, connect with fellow travelers, and explore new destinations. Start your journey today and make unforgettable memories!
      </h2>
      <button className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Plan Itinerary
      </button>
    </div>
  );
};

export default HeaderSection;