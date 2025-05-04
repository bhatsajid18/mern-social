import React, { useState, useEffect, useRef } from "react";
import AddPost from "../components/AddPost";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { Loading } from "../components/Loading";
import { IoAdd, IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { UserData } from "../context/UserContext";

const Reels = () => {
  const { reels, loading } = PostData();
  const { user } = UserData();
  const [showAddPost, setShowAddPost] = useState(false);
  const [visibleReelId, setVisibleReelId] = useState(null);
  const reelsRef = useRef([]);

  const handleToggleAddPost = () => {
    setShowAddPost((prev) => !prev);
  };

  const handlePostAdded = () => {
    setShowAddPost(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleReelId(entry.target.getAttribute("data-id"));
          }
        });
      },
      { threshold: 0.5 }
    );

    reelsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      reelsRef.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [reels]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white ml-0 sm:ml-0 md:ml-48 pt-16 sm:pt-16 md:pt-0">
      <div className="max-w-sm sm:max-w-2xl md:max-w-4xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src={user?.profilePic?.url}
              alt={user?.name}
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Reels Feed
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">
                Discover amazing short videos
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-5 md:px-6 py-2 rounded-full shadow-[0_4px_12px_rgba(168,85,247,0.4)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.6)] transition-all duration-300 flex items-center justify-center gap-2"
            onClick={handleToggleAddPost}
          >
            {showAddPost ? (
              <>
                <IoClose className="text-lg sm:text-xl" />
                <span className="text-sm sm:text-base">Close</span>
              </>
            ) : (
              <>
                <IoAdd className="text-lg sm:text-xl" />
                <span className="text-sm sm:text-base">Create Reel</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Add Reel Section */}
        <AnimatePresence>
          {showAddPost && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-4 sm:p-5 md:p-6 mb-6 sm:mb-8"
            >
              <AddPost type="reel" onPostAdded={handlePostAdded} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reels Feed */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {reels && reels.length > 0 ? (
            reels.map((reel, index) => (
              <motion.div
                key={reel._id}
                data-id={reel._id}
                ref={(el) => (reelsRef.current[index] = el)}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 overflow-hidden"
              >
                <PostCard
                  value={reel}
                  type="reel"
                  isPlaying={visibleReelId === reel._id}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 sm:py-12 md:py-16 bg-gray-800/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
            >
              <div className="mb-4 sm:mb-5 md:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl shadow-[0_8px_20px_rgba(168,85,247,0.5)]">
                  <IoAdd />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-2 sm:mb-3">
                Create Your First Reel
              </h3>
              <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-5 md:mb-6 max-w-xs sm:max-w-sm md:max-w-md mx-auto px-4">
                Share your creative short videos with your followers. Start by
                creating your first reel!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleAddPost}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-7 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full shadow-[0_4px_12px_rgba(168,85,247,0.4)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.6)] transition-all duration-300"
              >
                Create Reel
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reels;
