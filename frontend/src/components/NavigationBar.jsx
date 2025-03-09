import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BsCameraReelsFill, BsCameraReels } from "react-icons/bs";
import { IoSearchCircleOutline, IoSearchCircle } from "react-icons/io5";
import {
  IoChatbubbleEllipses,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";
import { RiAccountCircleFill, RiAccountCircleLine } from "react-icons/ri";
const NavigationBar = () => {
  const [tab, setTab] = useState(window.location.pathname);
  const navItems = [
    {
      path: "/",
      name: "Home",
      icon: tab === "/" ? <AiFillHome /> : <AiOutlineHome />,
    },
    {
      path: "/reels",
      name: "Reels",
      icon: tab === "/reels" ? <BsCameraReelsFill /> : <BsCameraReels />,
    },
    {
      path: "/search",
      name: "Search",
      icon: tab === "/search" ? <IoSearchCircle /> : <IoSearchCircleOutline />,
    },
    {
      path: "/chat",
      name: "Chat",
      icon:
        tab === "/chat" ? (
          <IoChatbubbleEllipses />
        ) : (
          <IoChatbubbleEllipsesOutline />
        ),
    },
    {
      path: "/account",
      name: "Account",
      icon:
        tab === "/account" ? <RiAccountCircleFill /> : <RiAccountCircleLine />,
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-48 bg-white shadow-lg  md:block">
      <div className="p-6 flex flex-col h-full">
        <h1 className="text-xl font-bold text-gray-800 mb-8">Navigation</h1>
        <div className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setTab(item.path)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                tab === item.path
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
