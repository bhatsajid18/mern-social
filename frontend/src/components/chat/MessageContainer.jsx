import React, { useEffect, useRef, useState } from "react";
import { UserData } from "../../context/UserContext";
import axios from "axios";
import { LoadingAnimation } from "../Loading";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { SocketData } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";

const MessageContainer = ({ setSelectedChat, selectedChat, setChats }) => {
  const [messages, setMessages] = useState([]);
  const [textMsg, setTextMsg] = useState(""); // Add this state here
  const { user } = UserData();
  const [loading, setLoading] = useState(false);
  const { socket } = SocketData();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedChat._id === message.chatId) {
        setMessages((prev) => [...prev, message]);
      }

      setChats((prev) => {
        const updatedChat = prev.map((chat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              latestMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return chat;
        });
        return updatedChat;
      });
    });

    return () => socket.off("newMessage");
  }, [socket, selectedChat, setChats]);

  async function fetchMessages() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "/api/messages/" + selectedChat.users[0]._id
      );

      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[100dvh] md:h-screen md:ml-6 bg-gray-50">
      {selectedChat && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-white shadow-sm p-3 md:p-4 flex items-center justify-between fixed top-0 left-0 md:left-48 right-0 z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/user/${selectedChat.users[0]._id}`)}
                className="relative group"
              >
                <img
                  src={selectedChat.users[0].profilePic.url}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full ring-2 ring-gray-100 transition-transform duration-300 group-hover:scale-105"
                  alt={selectedChat.users[0].name}
                />
              </button>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                  {selectedChat.users[0].name}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setSelectedChat(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 mt-16 md:mt-[72px] mb-[76px] md:mb-[68px]">
            {loading ? (
              <div className="flex-1 flex items-center justify-center h-full">
                <LoadingAnimation />
              </div>
            ) : (
              <div
                ref={messageContainerRef}
                className="h-full overflow-y-auto space-y-2 px-2 sm:px-4 py-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              >
                {messages.map((message, index) => (
                  <Message
                    key={index}
                    message={message.text}
                    ownMessage={message.sender === user._id}
                    setInputMessage={setTextMsg}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="fixed bottom-16 md:bottom-0 left-0 md:left-48 right-0 bg-white border-t shadow-lg">
            <MessageInput
              setMessages={setMessages}
              selectedChat={selectedChat}
              textMsg={textMsg}
              setTextMsg={setTextMsg}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
