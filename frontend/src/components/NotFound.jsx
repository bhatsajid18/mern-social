import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col space-y-6 text-center bg-white p-8 rounded-lg shadow-lg">
        <div className="text-gray-700 text-2xl font-semibold">Social Media</div>
        <div className="text-6xl font-bold text-gray-900">404</div>
        <div className="text-2xl font-medium text-gray-700">Page Not Found</div>
        <div className="text-gray-500 text-lg">
          Sorry, this page isn't available.
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 hover:scale-105 transition transform duration-200"
        >
          Visit Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFound;
