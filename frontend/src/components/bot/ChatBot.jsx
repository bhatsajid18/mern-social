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
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isBot
            ? "bg-white text-gray-800 rounded-tl-none"
            : "bg-indigo-600 text-white rounded-tr-none"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center items-start pt-6 px-4">
      <div className="flex flex-col h-[85vh] w-full max-w-2xl bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-white shadow-sm p-4 flex items-center justify-between">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                  <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                  <p className="text-sm text-gray-500">Always ready to help</p>
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={() => navigate("/chat")}
                className="w-8 h-8 rounded-full border border-gray-400 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition duration-200"
              >
                ✖
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            ref={messageContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
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
          <div className="bg-white p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
