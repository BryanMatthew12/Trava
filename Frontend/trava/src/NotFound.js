import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
    <h1 className="text-5xl font-bold text-blue-600 mb-4">404</h1>
    <p className="text-xl text-gray-700 mb-6">Oops! Page not found.</p>
    <Link
      to="/home"
      className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Back to Home
    </Link>
  </div>
);

export default NotFound;