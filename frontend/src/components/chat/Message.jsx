import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { IoMdChatboxes } from "react-icons/io";
import { BiSolidMagicWand } from "react-icons/bi";
import { FaCopy } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import toast from "react-hot-toast";
import.meta.env.Google_Api;

const Api_Key = process.env.Google_Api;
const Message = ({ ownMessage, message, setInputMessage }) => {
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMobileOptions, setShowMobileOptions] = useState(false);

  const generateAIResponse = async (prompt, type) => {
    try {
      setLoading(true);
      let aiPrompt = "";

      if (type === "reply") {
        aiPrompt = `Generate a natural and friendly reply to this message dont give multiple options: "${message}"`;
      } else if (type === "improve") {
        aiPrompt = `Rewrite the following message to enhance clarity, engagement, and readability while preserving its original intent. Improve structure and flow for better understanding no multiple options no double quotes only the rewritten message
        "${message}"`;
      }

      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${Api_Key}`,
        method: "post",
        data: {
          contents: [
            {
              parts: [{ text: aiPrompt }],
            },
          ],
        },
      });

      const suggestion = response.data.candidates[0].content.parts[0].text;
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("AI Error:", error);
      setAiSuggestion(
        "Sorry, I couldn't generate a suggestion at this moment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(aiSuggestion);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const handleUseAISuggestion = () => {
    if (setInputMessage && aiSuggestion) {
      setInputMessage(aiSuggestion);
      setAiSuggestion("");
      toast.success("Added to input!");
    }
  };

  return (
    <div
      className={`flex mb-3 ${ownMessage ? "justify-end" : "justify-start"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative max-w-[75%] md:max-w-[60%] group`}
      >
        <div className="flex items-end gap-2 relative">
          <div
            className={`inline-block rounded-2xl px-3 py-2 shadow-sm break-words
            ${
              ownMessage
                ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-none"
                : "bg-white text-gray-800 rounded-bl-none"
            }`}
            onClick={() =>
              !ownMessage && setShowMobileOptions(!showMobileOptions)
            } // Toggle on mobile
          >
            <p className="text-sm leading-relaxed">{message}</p>
          </div>

          {/* AI buttons - Show on hover for desktop, toggle for mobile */}
          {!ownMessage && (
            <div
              className={`flex flex-col gap-2 absolute -right-8 top-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity
                ${showMobileOptions ? "opacity-100" : "opacity-0"}`}
            >
              <button
                onClick={() => {
                  generateAIResponse(message, "reply");
                  setShowMobileOptions(false);
                }}
                className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded-full text-indigo-600 transition-colors"
                title="Get AI reply suggestion"
              >
                <IoMdChatboxes className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  generateAIResponse(message, "improve");
                  setShowMobileOptions(false);
                }}
                className="p-2 bg-purple-100 hover:bg-purple-200 rounded-full text-purple-600 transition-colors"
                title="Get message improvement suggestion"
              >
                <BiSolidMagicWand className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* AI Suggestion */}
        {aiSuggestion && !ownMessage && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2"
          >
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg shadow-sm border border-indigo-100">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <IoMdChatboxes className="text-indigo-600 w-4 h-4" />
                  <span className="text-xs font-medium text-indigo-600">
                    AI Suggestion
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUseAISuggestion}
                    className="p-1.5 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
                    title="Use as message"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleCopyToClipboard}
                    className="p-1.5 hover:bg-green-100 rounded-full text-green-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <MdDone className="w-4 h-4" />
                    ) : (
                      <FaCopy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setAiSuggestion("")}
                    className="p-1.5 hover:bg-red-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-700">{aiSuggestion}</p>
            </div>
          </motion.div>
        )}

        {/* Loading Indicator */}
        {loading && !ownMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2"
          >
            <div className="flex items-center gap-2 text-indigo-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
              <span className="text-xs">AI is thinking...</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Message;
