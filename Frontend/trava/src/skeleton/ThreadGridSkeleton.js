import React from "react";

const ThreadGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="border rounded-lg overflow-hidden shadow-md animate-pulse flex flex-col h-full"
        >
          <div className="w-full h-40 bg-gray-300"></div>
          <div className="p-4 flex flex-col h-full">
            <div className="w-3/4 h-6 bg-gray-300 rounded mb-2"></div>
            <div className="w-1/2 h-4 bg-gray-300 rounded mb-2"></div>
            <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
            <div className="flex justify-between items-center text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100"
                 style={{ marginTop: "auto" }}>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-4 bg-gray-300 rounded"></div>
                <div className="w-6 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreadGridSkeleton;