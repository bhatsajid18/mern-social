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
  const navigate = useNavigate(); // Initialize useNavigate

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
    <div className="flex flex-col h-[85vh] md:w-[70vw] lg:w-[80vw] bg-white">
      {selectedChat && (
        <div className="flex flex-col h-full">
          <div className="flex flex-row-reverse justify-between items-center mb-4">
            <div className="flex justify-between items-center mb-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full shadow-md transition-all duration-300"
                onClick={() => setSelectedChat(null)}
              >
                {/* Exit Chat */}X
              </button>
            </div>
            <div className="flex items-center gap-3 p-3 border-b bg-white shadow-sm">
              <button
                onClick={() => navigate(`/user/${selectedChat.users[0]._id}`)}
              >
                <img
                  src={selectedChat.users[0].profilePic.url}
                  className="w-10 h-10 rounded-full border cursor-pointer"
                  alt=""
                />
              </button>
              <span
                onClick={() => navigate(`/user/${selectedChat.users[0]._id}`)}
                className="font-semibold text-gray-700 hover:cursor-pointer"
              >
                {selectedChat.users[0].name}
              </span>
            </div>
          </div>
          {loading ? (
            <LoadingAnimation />
          ) : (
            <>
              <div
                ref={messageContainerRef}
                className="flex flex-col gap-2 flex-grow p-3 overflow-y-auto scrollbar-hide"
              >
                {messages &&
                  messages.map((e, index) => (
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
