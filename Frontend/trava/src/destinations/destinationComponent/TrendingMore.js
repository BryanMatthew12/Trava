import React from "react";
import { useSelector } from "react-redux";
import { selectPlaces } from "../../slices/places/placeSlice";
import { useLocation, useNavigate } from "react-router-dom";

const TrendingMore = () => {
  const allPlaces = useSelector(selectPlaces); // Fetch all places from Redux
  const location = useLocation();
  const navigate = useNavigate();

  // Get the province name from the query parameter
  const queryParams = new URLSearchParams(location.search);
  const provinceName = queryParams.get("province") || "Unknown Province";

  // Sort places by rating in descending order
  const sortedPlaces = [...allPlaces].sort(
    (a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0)
  );

  // Handle item click to navigate to PlanningItinerary
  const handleItemClick = (place) => {
    navigate(`/PlanningItinerary?source=destination&params=${place.id}`);
  };

  return (
    <div className="flex h-screen">
      {/* Left Section: List of Places */}
      <div className="w-1/2 bg-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">
            Trending <span className="text-blue-500">{provinceName}</span>
          </h1>
        </div>
        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {sortedPlaces.map((place, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(place)} // Navigate on click
                className="grid grid-cols-3 gap-4 items-center bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              >
                {/* Picture */}
                <img
                  src={place.place_picture}
                  alt={place.name}
                  className="w-full h-32 object-cover rounded-lg col-span-1"
                />
                {/* Details */}
                <div className="col-span-2 flex flex-col">
                  <h2 className="font-semibold text-lg">{place.name}</h2>
                  <p className="text-sm text-gray-600">{place.description}</p>
                  <p className="text-sm text-gray-500">Price: ${place.price}</p>
                  <p className="text-sm text-gray-500">Rating: {place.rating} ★</p>
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

export default TrendingMore;