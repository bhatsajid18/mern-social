import React from "react";
import { UserData } from "../../context/UserContext";
import { BsSendCheck } from "react-icons/bs";

const Chat = ({ chat, setSelectedChat, isOnline }) => {
  const { user: loggedInUser } = UserData();
  let user;
  if (chat) user = chat.users[0];
  return (
    <div>
      {user && (
        <div
          className="bg-white py-3 px-4 rounded-lg shadow-md cursor-pointer mt-4 transition-all duration-200 hover:bg-gray-100"
          onClick={() => setSelectedChat(chat)}
        >
          <div className="flex items-center gap-3">
            {isOnline && <div className="w-3 h-3 bg-green-500 rounded-full" />}
            <img
              src={user.profilePic.url}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-gray-300"
            />
            <span className="font-medium text-gray-700">{user.name}</span>
          </div>

          <span className="flex items-center gap-2 text-gray-600 mt-1 text-sm">
            {loggedInUser._id === chat.latestMessage.sender && (
              <BsSendCheck className="text-blue-500" />
            )}
            {chat.latestMessage.text && chat.latestMessage.text.slice(0, 18)}...
          </span>
        </div>
      )}
    </div>
  );
};

export default Chat;
