import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectPlaces } from "../../slices/places/placeSlice";
import { useNavigate } from "react-router-dom";
import { viewPlace } from "../../api/places/viewPlace"; // Tambahkan import ini

const RowDataTrending = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const allPlaces = useSelector(selectPlaces); // Fetch all places from Redux

  // Sort all places by rating in descending order and get the top 5
  const top5Places = React.useMemo(() => {
    if (!allPlaces || allPlaces.length === 0) {
      return [];
    }

    // Sort all places by rating in descending order
    const sortedPlaces = [...allPlaces]
      .sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0)) // Handle missing or invalid ratings
      .slice(0, 9); // Take the top 5 places
    return sortedPlaces;
  }, [allPlaces]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleItemClick = async (place) => {
    try {
      await viewPlace(place.id); // Tambah view sebelum navigasi
    } catch (error) {
      // Optional: handle error, misal tetap lanjut navigasi walau gagal
      console.error(error);
    }
    navigate(`/PlanningItinerary?source=destination&params=${place.id}`);
  };

  if (isMobile) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex gap-4 p-4">
          {top5Places.map((place, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(place)}
              className="flex-shrink-0 w-64 border p-4 rounded-lg shadow-lg bg-white flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow"
            >
              <img
                src={place.place_picture}
                alt={place.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h2 className="text-lg font-bold mt-2 text-center truncate w-full">
                {place.name}
              </h2>
              <p className="text-gray-600 text-center text-sm truncate w-full">
                {place.description}
              </p>
              <p className="text-sm text-gray-600">{place.rating} ★</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 w-full">
      {top5Places.map((place, index) => (
        <div
          key={index}
          onClick={() => handleItemClick(place)}
          className="border p-4 rounded-lg shadow-lg bg-white flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow"
        >
          <img
            src={place.place_picture}
            alt={place.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h2 className="text-lg font-bold mt-2 text-center truncate w-full">
            {place.name}
          </h2>
          <p className="text-gray-600 text-center text-sm truncate w-full">
            {place.description}
          </p>
          <p className="text-sm text-gray-600">{place.rating} ★</p>
        </div>
      ))}
    </div>
  );
};

export default RowDataTrending;