import React from "react";
import { motion } from "framer-motion";

const Message = ({ ownMessage, message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-3 ${ownMessage ? "text-right" : "text-left"}`}
    >
      <div
        className={`inline-block max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-2 shadow-sm
          ${
            ownMessage
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none"
              : "bg-white text-gray-800 rounded-bl-none"
          }`}
      >
        <p className="text-sm break-words">{message}</p>
      </div>
    </motion.div>
  );
};

export default Message;
