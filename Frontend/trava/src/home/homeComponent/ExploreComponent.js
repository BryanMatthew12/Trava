import React from "react";
import RowData from "./RowData";
import RowDataRecommended from "./RowDataRecommended";

const ExploreComponent = () => {
  const userPreferences = {
    category_ids: [1, 2, 3, 4, 5], // Example category IDs
  };

  return (
    <div className="w-full max-w-4xl px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Explore</h2>

      {/* Popular Destinations */}
      <div className="mb-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-gray-700">
            Popular Destinations
          </h3>
          <span className="text-blue-500 cursor-pointer hover:underline">
            See all
          </span>
        </div>
        <RowData />
      </div>

      {/* Recommended Experiences */}
      <div className="mb-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-gray-700">
            Recommended Experiences
          </h3>
          <span>See all</span>
        </div>
        <RowDataRecommended categoryIds={userPreferences.category_ids} />
      </div>

      {/* Hidden Gems */}
      <div>
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Hidden Gems</h3>
          <span>See all</span>
        </div>
        <RowData />
      </div>
    </div>
  );
};

export default ExploreComponent;
