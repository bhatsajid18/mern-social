import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";
import axios from "axios";
import { Loading } from "../components/Loading";
import { UserData } from "../context/UserContext";
import Modal from "../components/Modal";
import { BsGrid3X3, BsPlayBtn } from "react-icons/bs";
import { motion } from "framer-motion";

const UserAccount = ({ user: loggedInUser }) => {
  const navigate = useNavigate();

  const { posts, reels } = PostData();

  const [user, setUser] = useState([]);

  const params = useParams();

  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/" + params.id);

      setUser(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  console.log(user);

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  let myPosts;

  if (posts) {
    myPosts = posts.filter((post) => post.owner._id === user._id);
  }
  let myReels;

  if (reels) {
    myReels = reels.filter((reel) => reel.owner._id === user._id);
  }

  const [type, setType] = useState("post");

  const [index, setIndex] = useState(0);

  const prevReel = () => {
    if (index === 0) {
      console.log("null");
      return null;
    }
    setIndex(index - 1);
  };
  const nextReel = () => {
    if (index === myReels.length - 1) {
      console.log("null");
      return null;
    }
    setIndex(index + 1);
  };

  const [followed, setFollowed] = useState(false);

  const { followUser } = UserData();

  const followHandler = () => {
    setFollowed(!followed);
    followUser(user._id, fetchUser);
  };

  const followers = user.followers;

  useEffect(() => {
    if (followers && followers.includes(loggedInUser._id)) setFollowed(true);
  }, [user]);

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  async function followData() {
    try {
      const { data } = await axios.get("/api/user/followdata/" + user._id);

      setFollowersData(data.followers);
      setFollowingsData(data.followings);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    followData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ml-0 md:ml-48">
      {loading ? (
        <Loading />
      ) : (
        user && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 mb-6 md:mb-8">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                {/* Profile Image */}
                <motion.div whileHover={{ scale: 1.02 }} className="relative">
                  <img
                    src={user.profilePic.url}
                    alt={user.name}
                    className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover ring-4 ring-gray-50 shadow-lg"
                  />
                </motion.div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                      {user.name}
                    </h1>
                    {user._id !== loggedInUser._id && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={followHandler}
                        className={`px-6 py-2 rounded-full font-medium transition-all w-full md:w-auto ${
                          followed
                            ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                        }`}
                      >
                        {followed ? "Following" : "Follow"}
                      </motion.button>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-6">
                    <div className="text-center p-2 md:p-4 rounded-xl bg-gray-50">
                      <div className="text-lg md:text-xl font-bold text-gray-900">
                        {myPosts?.length || 0}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        Posts
                      </div>
                    </div>
                    <div
                      onClick={() => setShow(true)}
                      className="text-center p-2 md:p-4 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-lg md:text-xl font-bold text-gray-900">
                        {user.followers.length}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        Followers
                      </div>
                    </div>
                    <div
                      onClick={() => setShow1(true)}
                      className="text-center p-2 md:p-4 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-lg md:text-xl font-bold text-gray-900">
                        {user.followings.length}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        Following
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="space-y-1 md:space-y-2 text-sm md:text-base">
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600 capitalize">{user.gender}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-3 md:p-4 mb-6 md:mb-8">
              <div className="flex justify-center gap-4 md:gap-8">
                <button
                  onClick={() => setType("post")}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all text-sm md:text-base ${
                    type === "post"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <BsGrid3X3 className="text-lg md:text-xl" />
                  <span className="font-medium">Posts</span>
                </button>
                <button
                  onClick={() => setType("reel")}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all text-sm md:text-base ${
                    type === "reel"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <BsPlayBtn className="text-lg md:text-xl" />
                  <span className="font-medium">Reels</span>
                </button>
              </div>
            </div>

            {/* Content Display */}
            <div className="space-y-4 md:space-y-6">
              {type === "post" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {myPosts && myPosts.length > 0 ? (
                    myPosts.map((post) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <PostCard type="post" value={post} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 md:py-12 bg-white rounded-xl md:rounded-2xl shadow-lg">
                      <p className="text-gray-500 text-base md:text-lg">
                        No posts yet
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-center">
                  {myReels && myReels.length > 0 ? (
                    <div className="flex items-center gap-4 md:gap-6">
                      <PostCard type="reel" value={myReels[index]} />
                      <div className="flex flex-col gap-4">
                        {index > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevReel}
                            className="p-3 md:p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
                          >
                            <FaArrowUp className="text-gray-700" />
                          </motion.button>
                        )}
                        {index < myReels.length - 1 && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextReel}
                            className="p-3 md:p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
                          >
                            <FaArrowDownLong className="text-gray-700" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 md:py-12 bg-white rounded-xl md:rounded-2xl shadow-lg w-full max-w-md">
                      <p className="text-gray-500 text-base md:text-lg">
                        No reels yet
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Modals */}
      {show && (
        <Modal value={followersData} title="Followers" setShow={setShow} />
      )}
      {show1 && (
        <Modal value={followingsData} title="Followings" setShow={setShow1} />
      )}
    </div>
  );
};

export default UserAccount;
