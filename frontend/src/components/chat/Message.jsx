import React from "react";
const Message = ({ ownMessage, message }) => {
  return (
    <div className={`mb-3 ${ownMessage ? "text-right" : "text-left"}`}>
      <span
        className={`inline-block px-4 py-2 rounded-xl shadow-md max-w-xs break-words ${
          ownMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        {message}
      </span>
    </div>
  );
};

export default Message;
