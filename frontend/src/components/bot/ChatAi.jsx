import React from 'react'
import { motion } from "framer-motion";
import { BsSendCheck } from "react-icons/bs";
import firefoxLogo from './logo-firefox.svg';
import { useNavigate } from 'react-router-dom';
import ChatBot from './ChatBot';
const ChatAi = () => {
    const navigate=useNavigate()
  return (
    <div>
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
      onClick={() => {navigate("./chatbot")}}
    >
      <div className="bg-white rounded-xl p-4 mb-3 hover:bg-gray-50 transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={firefoxLogo}
              alt=""
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
            />
            
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Chime Bot</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
             
                <BsSendCheck className="text-blue-500" />
              <p>Ask Anything</p>
              
            </p>
          </div>
        </div>
      </div>
    </motion.div>
    </div>
  )
}

export default ChatAi
