import React, { useState } from "react";
import { ChatData } from "../../context/ChatContext";
import toast from "react-hot-toast";
import axios from "axios";

const MessageInput = ({ setMessages, selectedChat, textMsg, setTextMsg }) => {
  const { setChats } = ChatData();

  const handleMessage = async (e) => {
    e.preventDefault();
    if (!textMsg.trim()) return; // Add validation

    try {
      const { data } = await axios.post("/api/messages", {
        message: textMsg,
        recieverId: selectedChat.users[0]._id,
      });

      setMessages((message) => [...message, data]);
      setTextMsg(""); // Clear input after sending
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
    <div className="p-3 bg-white border-t border-gray-300">
      <form onSubmit={handleMessage} className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Enter Message"
          className="border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={textMsg}
          onChange={(e) => setTextMsg(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition-all"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
