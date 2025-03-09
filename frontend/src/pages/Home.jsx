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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white ml-48">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img
              src={user?.profilePic?.url}
              alt={user?.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Your Feed
              </h1>
              <p className="text-gray-500 text-sm">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2 hover:shadow-xl transition-shadow"
            onClick={handleToggleAddPost}
          >
            {showAddPost ? (
              <IoClose className="text-xl" />
            ) : (
              <IoAdd className="text-xl" />
            )}
            <span>{showAddPost ? "Close" : "Create Post"}</span>
          </motion.button>
        </div>

        {showAddPost && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
          >
            <AddPost type="post" onPostAdded={handlePostAdded} />
          </motion.div>
        )}

        <div className="space-y-8">
          {posts && posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <PostCard value={post} type="post" />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl">
                  <IoAdd />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-3">
                Create Your First Post
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Share your moments, thoughts, and experiences with your
                followers. Start by creating your first post!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleAddPost}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Post
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {posts?.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-white text-blue-600 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 border border-gray-200"
        >
          <svg
            className="w-6 h-6"
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
