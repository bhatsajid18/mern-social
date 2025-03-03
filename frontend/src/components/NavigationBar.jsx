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

  return (
    <div className="fixed bottom-0 w-full bg-white py-3 shadow-lg rounded-t-lg">
      <div className="flex justify-around">
        <Link
          to={"/"}
          onClick={() => setTab("/")}
          className={`flex flex-col items-center text-2xl p-2 transition duration-300 ${
            tab === "/" ? "text-blue-500" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span>{tab === "/" ? <AiFillHome /> : <AiOutlineHome />}</span>
        </Link>
        <Link
          to={"/reels"}
          onClick={() => setTab("/reels")}
          className={`flex flex-col items-center text-2xl p-2 transition duration-300 ${
            tab === "/reels"
              ? "text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span>
            {tab === "/reels" ? <BsCameraReelsFill /> : <BsCameraReels />}
          </span>
        </Link>
        <Link
          to={"/search"}
          onClick={() => setTab("/search")}
          className={`flex flex-col items-center text-2xl p-2 transition duration-300 ${
            tab === "/search"
              ? "text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span>
            {tab === "/search" ? <IoSearchCircle /> : <IoSearchCircleOutline />}
          </span>
        </Link>
        <Link
          to={"/chat"}
          onClick={() => setTab("/chat")}
          className={`flex flex-col items-center text-2xl p-2 transition duration-300 ${
            tab === "/chat"
              ? "text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span>
            {tab === "/chat" ? (
              <IoChatbubbleEllipses />
            ) : (
              <IoChatbubbleEllipsesOutline />
            )}
          </span>
        </Link>
        <Link
          to={"/account"}
          onClick={() => setTab("/account")}
          className={`flex flex-col items-center text-2xl p-2 transition duration-300 ${
            tab === "/account"
              ? "text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span>
            {tab === "/account" ? (
              <RiAccountCircleFill />
            ) : (
              <RiAccountCircleLine />
            )}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
