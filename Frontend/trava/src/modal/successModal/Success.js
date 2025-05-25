import React, { useEffect } from "react";

const Success = ({ message}) => {

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 absolute inset-0"></div>
      <div className="bg-white rounded-lg shadow-lg p-4 z-10">
        <p className="text-center text-green-600 font-semibold">
          {message || "Success!"}
        </p>
      </div>
    </div>
  );
};

export default Success;