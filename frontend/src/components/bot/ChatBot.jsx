import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { LoadingAnimation } from "../Loading";
import { useNavigate } from "react-router-dom";
import.meta.env.Google_Api;
const Api_Key = process.env.Google_Api;

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messageContainerRef = useRef(null);
  const navigate = useNavigate();

  const generateAnswer = async (question) => {
    try {
      setLoading(true);
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${Api_Key}`,
        method: "post",
        data: {
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
        },
      });

      const answer = response.data.candidates[0].content.parts[0].text;
      setMessages((prev) => [
        ...prev,
        { type: "user", text: question },
        { type: "bot", text: answer },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { type: "user", text: question },
        {
          type: "bot",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ]);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      generateAnswer(inputMessage);
      setInputMessage("");
    }
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const Message = ({ message, isBot }) => (
    <div
      className={`flex ${isBot ? "justify-start" : "justify-end"} mb-3 md:mb-4`}
    >
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
          isBot
            ? "bg-white text-gray-800 rounded-tl-none"
            : "bg-indigo-600 text-white rounded-tr-none"
        }`}
      >
        <p className="text-sm md:text-base whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 md:static flex justify-center items-start pt-0 px-0 bg-gray-100/80 md:bg-transparent">
      {/* Main Container - Account for sidebar on desktop */}
      <div className="flex flex-col h-[100dvh] md:h-screen w-full md:ml-48 md:w-[calc(100vw-12rem)] bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-white shadow-sm p-3 md:p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                  AI Assistant
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  Always ready to help
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/chat")}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition duration-200 flex items-center justify-center"
            >
              ✖
            </button>
          </div>
          {/* Messages Container */}
          <div
            ref={messageContainerRef}
            className="flex-1 p-3 md:p-6 overflow-y-auto space-y-3 md:space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            {messages.map((message, index) => (
              <Message
                key={index}
                message={message.text}
                isBot={message.type === "bot"}
              />
            ))}
            {loading && (
              <div className="flex justify-center">
                <LoadingAnimation />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-white p-3 md:p-6 border-t shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 md:gap-4 mb-16 md:mb-0 max-w-4xl mx-auto"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 md:px-8 py-3 bg-indigo-600 text-white text-base md:text-lg rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-sm"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
