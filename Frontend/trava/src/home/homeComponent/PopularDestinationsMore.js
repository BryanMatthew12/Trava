import React from "react";
import { useSelector } from "react-redux";
import { selectHome } from "../../slices/home/homeSlice";
import { useNavigate } from "react-router-dom";

const PopularDestinationsMore = () => {
  const homes = useSelector(selectHome); // Fetch homes from Redux
  const navigate = useNavigate();

  // Handle navigation to a detailed page
  const handleItemClick = (home) => {
    navigate(`/PlanningItinerary?source=home&params=${home.id}`);
  };

  return (
    <div className="flex h-screen">
      {/* Left Section: List of Popular Destinations */}
      <div className="w-1/2 bg-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Popular Destinations</h1>
        </div>
        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {homes.map((home, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(home)} // Navigate on click
                className="grid grid-cols-3 gap-4 items-center bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              >
                {/* Picture */}
                <img
                  src={home.place_picture}
                  alt={home.name}
                  className="w-full h-32 object-cover rounded-lg col-span-1"
                />
                {/* Details */}
                <div className="col-span-2 flex flex-col">
                  <h2 className="font-semibold text-lg">{home.name}</h2>
                  <p className="text-sm text-gray-600">{home.description}</p>
                  <p className="text-sm text-gray-500">Rating: {home.rating} ★</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section: Static Maps Box */}
      <div className="w-1/2 bg-gray-200">
        <div className="h-full flex items-center justify-center">
          <h2 className="text-gray-600 text-xl">Maps</h2>
        </div>
      </div>
    </div>
  );
};

export default PopularDestinationsMore;