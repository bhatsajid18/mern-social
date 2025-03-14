import React, { useEffect, useState } from "react";
import { ChatData } from "../context/ChatContext";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Chat from "../components/chat/Chat";
import MessageContainer from "../components/chat/MessageContainer";
import { SocketData } from "../context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import ChatAi from "../components/bot/ChatAi";

const ChatPage = ({ user }) => {
  const { createChat, selectedChat, setSelectedChat, chats, setChats } =
    ChatData();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { onlineUsers } = SocketData();

  async function fetchAllUsers() {
    try {
      const { data } = await axios.get(`/api/user/all?search=${query}`);
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }

  const getAllChats = async () => {
    try {
      const { data } = await axios.get("/api/messages/chats");
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      fetchAllUsers();
    }
  }, [query]);

  useEffect(() => {
    getAllChats();
  }, []);

  async function createNewChat(id) {
    await createChat(id);
    setIsSearching(false);
    setQuery("");
    await getAllChats();
    const newChat = chats.find((chat) => chat.users.some((u) => u._id === id));
    if (newChat) {
      setSelectedChat(newChat);
    }
  }

  const handleCancelSearch = () => {
    setIsSearching(false);
    setQuery("");
    setUsers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ml-48 p-6">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedChat ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder={
                      isSearching ? "Search users..." : "Search chats..."
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsSearching(true)}
                  />
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  {(isSearching || query) && (
                    <button
                      onClick={handleCancelSearch}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <IoClose className="text-xl" />
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {isSearching ? "Search Results" : "Recent Chats"}
                </h2>
                <div className="space-y-2">
                  {isSearching ? (
                    users.length > 0 ? (
                      users.map((u) => (
                        <motion.div
                          key={u._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => createNewChat(u._id)}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-all"
                        >
                          <img
                            src={u.profilePic.url}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                            alt=""
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {u.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Click to start chat
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No users found
                      </p>
                    )
                  ) : chats.length > 0 ? (
                    <>
                      <ChatAi />
                      {chats.map((chat) => (
                        <Chat
                          key={chat._id}
                          chat={chat}
                          setSelectedChat={setSelectedChat}
                          isOnline={onlineUsers.includes(chat.users[0]._id)}
                        />
                      ))}
                    </>
                  ) : (
                    // <p className="text-center text-gray-500 py-4">
                    //   No chats yet
                    // </p>
                    <div>
                      <ChatAi />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <MessageContainer
                setSelectedChat={setSelectedChat}
                selectedChat={selectedChat}
                setChats={setChats}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatPage;
