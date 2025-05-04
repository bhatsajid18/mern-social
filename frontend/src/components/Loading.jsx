import React from "react";

export const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm z-50">
      <div className="relative">
        {/* Main spinner */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-ping"></div>
        </div>

        {/* Inner spinner */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
        </div>

        {/* Loading text */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <p className="text-blue-600 text-sm sm:text-base font-medium animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
};

export const LoadingAnimation = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
      <span className="text-sm text-blue-600 font-medium">Loading</span>
    </div>
  );
};

// Add these custom animations to your tailwind.config.js
/**
module.exports = {
  theme: {
    extend: {
      animation: {
        'ping': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        ping: {
          '75%, 100%': {
            transform: 'scale(1.2)',
            opacity: '0',
          },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
    },
  },
  plugins: [],
}
*/
