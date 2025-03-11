import React from "react";
import { UserData } from "../../context/UserContext";
import { BsSendCheck } from "react-icons/bs";
import { motion } from "framer-motion";
import { SocketData } from "../../context/SocketContext";
import ChatBot from "../bot/ChatBot";
import ChatAi from "../bot/ChatAi";

const Chat = ({ chat, setSelectedChat }) => {
  const { user: loggedInUser } = UserData();
  const { onlineUsers } = SocketData();
  let user = chat?.users[0];

  if (!user) return null;

  const isUserOnline = onlineUsers.includes(user._id);

  return (
    <>
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
      onClick={() => setSelectedChat(chat)}
    >
      <div className="bg-white rounded-xl p-4 mb-3 hover:bg-gray-50 transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user.profilePic.url}
              alt=""
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
            />
            {isUserOnline && (
              <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              {loggedInUser._id === chat.latestMessage.sender && (
                <BsSendCheck className="text-blue-500" />
              )}
              {chat.latestMessage.text?.slice(0, 25)}
              {chat.latestMessage.text?.length > 25 ? "..." : ""}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
    <div>
      <ChatAi/>
    </div>
    </>
  );
};

export default Chat;
