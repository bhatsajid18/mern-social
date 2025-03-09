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
    <div className="flex flex-col h-[93vh] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden shadow-lg">
      {selectedChat && (
        <div className="flex flex-col h-full">
          <div className="bg-white shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/user/${selectedChat.users[0]._id}`)}
              >
                <img
                  src={selectedChat.users[0].profilePic.url}
                  className="w-10 h-10 rounded-full ring-2 ring-gray-100"
                  alt=""
                />
              </button>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedChat.users[0].name}
                </h3>
                {/* <p className="text-sm text-gray-500">Online</p> */}
              </div>
            </div>
            <button
              onClick={() => setSelectedChat(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-500"
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

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingAnimation />
            </div>
          ) : (
            <>
              <div
                ref={messageContainerRef}
                className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              >
                {messages.map((e, index) => (
                  <Message
                    key={index}
                    message={e.text}
                    ownMessage={e.sender === user._id}
                  />
                ))}
              </div>
              <MessageInput
                setMessages={setMessages}
                selectedChat={selectedChat}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
