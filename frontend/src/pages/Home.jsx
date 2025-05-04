import React, { useState } from "react";
import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
import { PostData } from "../context/PostContext";
import { Loading } from "../components/Loading";
import { IoAdd, IoClose } from "react-icons/io5";
import { UserData } from "../context/UserContext";
import { motion } from "framer-motion";

const Home = () => {
  const { posts, loading } = PostData();
  const { user } = UserData();
  const [showAddPost, setShowAddPost] = useState(false);

  const handleToggleAddPost = () => {
    setShowAddPost((prev) => !prev);
  };

  const handlePostAdded = () => {
    setShowAddPost(false);
  };

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
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Your Feed
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-5 md:px-6 py-2 rounded-full shadow-lg flex items-center justify-center sm:justify-start gap-2 hover:shadow-xl transition-shadow"
            onClick={handleToggleAddPost}
          >
            {showAddPost ? (
              <IoClose className="text-lg sm:text-xl" />
            ) : (
              <IoAdd className="text-lg sm:text-xl" />
            )}
            <span className="text-sm sm:text-base">
              {showAddPost ? "Close" : "Create Post"}
            </span>
          </motion.button>
        </div>

        {/* Add Post Section */}
        {showAddPost && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 border border-gray-100"
          >
            <AddPost type="post" onPostAdded={handlePostAdded} />
          </motion.div>
        )}

        {/* Posts Section */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {posts && posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <PostCard value={post} type="post" />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 sm:py-12 md:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="mb-4 sm:mb-5 md:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl">
                  <IoAdd />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-2 sm:mb-3">
                Create Your First Post
              </h3>
              <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-5 md:mb-6 max-w-xs sm:max-w-sm md:max-w-md mx-auto px-4">
                Share your moments, thoughts, and experiences with your
                followers. Start by creating your first post!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleAddPost}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-7 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Post
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {posts?.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 sm:bottom-16 md:bottom-8 right-4 sm:right-6 md:right-8 bg-white text-blue-600 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 border border-gray-200"
        >
          <svg
            className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default Home;
