import React from "react";
import RowData from "./RowData";

const ExploreComponent = () => {
  return (
    <div className="w-full max-w-4xl px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Explore</h2>

      {/* Popular Destinations */}
      <div className="mb-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-gray-700">
            Popular Destinations
          </h3>
          <span>See all</span>
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
        <RowData />
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
