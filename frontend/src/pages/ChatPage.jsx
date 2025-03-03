import React, { useEffect, useState } from "react";
import { ChatData } from "../context/ChatContext";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import Chat from "../components/chat/Chat";
import MessageContainer from "../components/chat/MessageContainer";
import { SocketData } from "../context/SocketContext";

const ChatPage = ({ user }) => {
  const { createChat, selectedChat, setSelectedChat, chats, setChats } =
    ChatData();

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(false);

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
    fetchAllUsers();
  }, [query]);

  useEffect(() => {
    getAllChats();
  }, []);

  async function createNewChat(id) {
    await createChat(id);
    setSearch(false);
    setQuery(""); // Clear search input
    getAllChats();
    setSelectedChat(
      chats.find((chat) => chat.users.some((u) => u._id === id)) || null
    );
  }

  const { onlineUsers } = SocketData();

  return (
    <div className="w-full md:w-[750px] md:p-4">
      <div className="flex flex-col md:flex-row gap-4 mx-auto">
        {/* Sidebar for user search and chat list */}
        <div
          className={`w-full md:w-[30%] ${selectedChat && "hidden md:block"}`}
        >
          <div className="top flex items-center gap-2">
            <button
              className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-md flex items-center gap-2 transition-all duration-300 ${
                search ? "" : "hidden"
              }`}
              onClick={() => setSearch(!search)}
            >
              {
                search ? "X" : ""
                /*<FaSearch />*/
              }
            </button>
            <input
              type="text"
              className={`border border-gray-300 rounded-lg p-2 w-full md:w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500 `}
              onClick={() => setSearch(!search)}
              placeholder="Search user"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Show only search users when search is active */}
          {search ? (
            <div className="users mt-2">
              {users && users.length > 0 ? (
                users.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => createNewChat(u._id)}
                    className="bg-gray-200 hover:bg-gray-300 text-black p-2 mt-2 cursor-pointer flex items-center gap-2 rounded-lg transition-all duration-200"
                  >
                    <img
                      src={u.profilePic.url}
                      className="w-8 h-8 rounded-full"
                      alt=""
                    />
                    {u.name}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 mt-2">No users found</p>
              )}
            </div>
          ) : (
            /* Show chat list only when search is NOT active */
            <div className="flex flex-col justify-center items-center mt-2">
              {chats.map((chat) => (
                <Chat
                  key={chat._id}
                  chat={chat}
                  setSelectedChat={setSelectedChat}
                  isOnline={onlineUsers.includes(chat.users[0]._id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div
          className={`w-full md:w-[70%] ${
            selectedChat === null ? "hidden md:block" : ""
          }`}
        >
          {selectedChat === null ? (
            <div className="mx-20 mt-40 text-2xl text-center">
              Hello 👋 {user.name}, select a chat to start a conversation
            </div>
          ) : (
            <div>
              {/* <div className="flex justify-between items-center mb-4">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full shadow-md transition-all duration-300"
                  onClick={() => setSelectedChat(null)}
                >
                  Exit Chat
                </button>
              </div> */}
              <MessageContainer
                setSelectedChat={setSelectedChat}
                selectedChat={selectedChat}
                setChats={setChats}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
