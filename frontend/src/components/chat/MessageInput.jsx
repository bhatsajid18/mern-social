import React, { useState } from "react";
import { ChatData } from "../../context/ChatContext";
import toast from "react-hot-toast";
import axios from "axios";
import { IoSend } from "react-icons/io5";
import { motion } from "framer-motion";

const MessageInput = ({ setMessages, selectedChat }) => {
  const [textMsg, setTextMsg] = useState("");
  const { setChats } = ChatData();

  const handleMessage = async (e) => {
    e.preventDefault();
    if (!textMsg.trim()) return;

    try {
      const { data } = await axios.post("/api/messages", {
        message: textMsg,
        recieverId: selectedChat.users[0]._id,
      });

      setMessages((messages) => [...messages, data]);
      setTextMsg("");
      setChats((prev) => {
        const updatedChat = prev.map((chat) => {
          if (chat._id === selectedChat._id) {
            return {
              ...chat,
              latestMessage: {
                text: textMsg,
                sender: data.sender,
              },
            };
          }
          return chat;
        });
        return updatedChat;
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      <form onSubmit={handleMessage} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={textMsg}
          onChange={(e) => setTextMsg(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:shadow-lg transition-all"
          disabled={!textMsg.trim()}
        >
          <IoSend className="text-xl" />
        </motion.button>
      </form>
    </div>
  );
};

export default MessageInput;
