import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LoadingAnimation } from "../components/Loading";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchUsers() {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      setUsers([]);
      setMessage("Please enter a name to search.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const { data } = await axios.get("/api/user/all?search=" + trimmedSearch);
      setUsers(data);
      if (data.length === 0) {
        setMessage("No users found.");
      }
    } catch (error) {
      console.log(error);
      setMessage("Error fetching users. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchUsers();
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 ml-48 min-h-screen">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Find People</h1>
          <p className="text-gray-500">
            Search for users and connect with them
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 text-xl" />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <IoClose className="text-xl" />
              </button>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchUsers}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <FiSearch className="text-xl" />
            Search
          </motion.button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingAnimation />
            </div>
          ) : message ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 text-gray-500"
            >
              {message}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4"
            >
              {users.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/user/${user._id}`}
                    className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={user.profilePic.url}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500">View Profile</p>
                      </div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="text-blue-500"
                      >
                        →
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
