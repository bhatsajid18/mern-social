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
      { threshold: 0.5 } // Trigger when 50% of the reel is visible
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white ml-48">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img
              src={user?.profilePic?.url}
              alt={user?.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-500 shadow-lg shadow-purple-500/20"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Reels Feed
              </h1>
              <p className="text-gray-400 text-sm">
                Discover amazing short videos
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg shadow-purple-500/20 flex items-center gap-2 hover:shadow-xl transition-shadow"
            onClick={handleToggleAddPost}
          >
            {showAddPost ? (
              <IoClose className="text-xl" />
            ) : (
              <IoAdd className="text-xl" />
            )}
            <span>{showAddPost ? "Close" : "Create Reel"}</span>
          </motion.button>
        </div>

        {/* Add Reel Section */}
        <AnimatePresence>
          {showAddPost && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className=" bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
            >
              <AddPost type="reel" onPostAdded={handlePostAdded} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reels Feed */}
        <div className="space-y-8">
          {reels && reels.length > 0 ? (
            reels.map((reel, index) => (
              <motion.div
                key={reel._id}
                data-id={reel._id}
                ref={(el) => (reelsRef.current[index] = el)}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
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
              className="text-center py-16 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
            >
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl">
                  <IoAdd />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-3">
                Create Your First Reel
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Share your creative short videos with your followers. Start by
                creating your first reel!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleAddPost}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full shadow-lg shadow-purple-500/20 hover:shadow-xl transition-all duration-300"
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
