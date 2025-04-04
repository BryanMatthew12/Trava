import React from 'react';

const PopularCitiesSection = ({ destinations }) => {
  return (
    <div className="mt-16 w-[85%] text-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {destinations.map((destination, index) => (
          <div key={index} className="relative overflow-hidden rounded-2xl shadow-lg">
            <img src={destination.image} alt={destination.title} className="w-full h-48 sm:h-64 object-cover" />
            <div className="absolute bottom-0 left-0 text-white p-4">
              <h3 className="text-base sm:text-lg font-bold text-left">{destination.title}</h3>
              <p className="text-xs sm:text-sm text-left">{destination.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCitiesSection;