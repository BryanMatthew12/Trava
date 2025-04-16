import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectHomesByCategoryIds } from "../../slices/home/homeSlice";

const RowDataRecommended = ({ categoryIds = [] }) => {
  const navigate = useNavigate();

  // Filter homes by category IDs
  const recommendedHomes = useSelector((state) => {
    console.log("Category IDs passed to RowDataRecommended:", categoryIds); // Debugging
    return selectHomesByCategoryIds(categoryIds)(state);
  });

  // Handle navigation to a detailed page
  const handleItemClick = (home) => {
    navigate(`/PlanningItinerary?source=home&params=${home.id}`);
  };

  if (!recommendedHomes || recommendedHomes.length === 0) {
    return <p>No recommended homes available to display.</p>; // Show a message if no homes are available
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {recommendedHomes.map((home, index) => (
        <div
          key={index}
          onClick={() => handleItemClick(home)}
          className="border p-4 rounded-lg shadow-lg bg-white flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow"
        >
          <img
            src={home.place_picture}
            alt={home.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h2 className="text-lg font-bold mt-2 text-center truncate w-full">
            {home.name}
          </h2>
          <p className="text-gray-600 text-center text-sm truncate w-full">
            {home.description}
          </p>
          <p className="text-sm text-gray-500">Rating: {home.rating} ★</p>
        </div>
      ))}
    </div>
  );
};

export default RowDataRecommended;