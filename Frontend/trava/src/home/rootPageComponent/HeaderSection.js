import React from 'react';
import { useNavigate } from 'react-router-dom';
const HeaderSection = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center w-[85%] mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-4xl mb-4 font-bold bg-clip-text">
        Discover the truly Java unforgettable experience
      </h1>
      <h2 className="text-sm sm:text-sm md:text-sm mb-8 max-w-full md:max-w-3xl font-sm bg-clip-text mx-auto">
        Plan your next adventure with ease using Trava. Create itineraries, connect with fellow travelers, and explore new destinations. Start your journey today and make unforgettable memories!
      </h2>
      <button 
      className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      onClick={() => {
        navigate('/Login');
      }}
      >
        Plan Itinerary
      </button>
    </div>
  );
};

export default HeaderSection;