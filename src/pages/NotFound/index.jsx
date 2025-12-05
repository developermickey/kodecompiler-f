import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6">
      
      {/* Animated 404 Number */}
      <h1 className="text-[120px] md:text-[160px] font-extrabold text-blue-500 drop-shadow-lg animate-pulse">
        404
      </h1>

      {/* Message */}
      <p className="text-xl md:text-2xl text-gray-300 mt-[-20px]">
        Oops! The page you're looking for does not exist.
      </p>

      {/* Subtext */}
      <p className="text-gray-500 mt-2 mb-6">
        It might have been removed or the link is broken.
      </p>

      {/* Back Button */}
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-all rounded-lg text-lg font-medium shadow-lg"
      >
        Go Back Home
      </Link>

      {/* Decorative Glow Effect */}
      <div className="absolute bottom-10 w-[300px] h-[300px] rounded-full bg-blue-600 blur-[130px] opacity-20"></div>
    </div>
  );
};

export default NotFound;
