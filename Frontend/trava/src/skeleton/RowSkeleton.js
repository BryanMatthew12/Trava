import React from "react";

const RowSkeleton = () => {
  return (
    <div className="border p-4 rounded-lg shadow-lg bg-gray-200 animate-pulse flex flex-col items-center">
      <div className="w-full h-48 bg-gray-300 rounded-lg mb-2"></div>
      <div className="w-3/4 h-6 bg-gray-300 rounded mb-2"></div>
      <div className="w-1/2 h-4 bg-gray-300 rounded mb-2"></div>
      <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
    </div>
  );
};

export default RowSkeleton;