import React, { useEffect, useState } from "react";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaPlus } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";
import Modal from "../components/Modal";
import { Loading } from "../components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Account = ({ user }) => {
  const { logoutUser, updateProfilePic, updateProfileName } = UserData();
  const { posts, reels, loading } = PostData();
  const [type, setType] = useState("post");
  const [file, setFile] = useState(null);
  const [name, setName] = useState(user?.name || "");
  const [showInput, setShowInput] = useState(false);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [showUpdatePass, setShowUpdatePass] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const myPosts = posts?.filter((post) => post.owner._id === user._id) || [];
  const myReels = reels?.filter((reel) => reel.owner._id === user._id) || [];

  useEffect(() => {
    async function followData() {
      try {
        const { data } = await axios.get(`/api/user/followdata/${user._id}`);
        setFollowersData(data.followers);
        setFollowingsData(data.followings);
      } catch (error) {
        console.log(error);
      }
    }
    followData();
  }, [user]);

  const updateProfileHandler = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      updateProfilePic(user._id, formData, setFile);
    }
    if (name !== user.name) {
      updateProfileName(user._id, name, setShowInput);
    }
  };

  async function updatePassword(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/user/${user._id}`, {
        oldPassword,
        newPassword,
      });
      toast.success(data.message);
      setOldPassword("");
      setNewPassword("");
      setShowUpdatePass(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="bg-gray-50 min-h-screen ml-0 sm:ml-0 md:ml-48 pt-16 sm:pt-16 md:pt-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto">
        {/* Profile Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
            {/* Profile Picture Section */}
            <div className="relative">
              <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-lg">
                <img
                  src={user?.profilePic.url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="fileInput"
                className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 sm:p-2.5 lg:p-3 rounded-full cursor-pointer transition-colors shadow-md"
              >
                <FaPlus className="text-xs sm:text-sm lg:text-base" />
              </label>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            {/* Profile Info Section */}
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                {showInput ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      className="w-full sm:w-auto border-2 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Name"
                    />
                    <button onClick={() => setShowInput(false)}>
                      <IoCloseCircleOutline className="text-xl sm:text-2xl text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                      {user?.name}
                    </h2>
                    <button
                      onClick={() => setShowInput(true)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <CiEdit className="text-lg sm:text-xl" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm sm:text-base">
                {user?.email}
              </p>

              <div className="flex gap-4 sm:gap-6 lg:gap-8 justify-center lg:justify-start">
                <button
                  onClick={() => setShow(true)}
                  className="text-gray-700 hover:text-blue-600 transition-colors text-sm sm:text-base"
                >
                  <span className="font-semibold">
                    {user?.followers.length}
                  </span>{" "}
                  followers
                </button>
                <button
                  onClick={() => setShow1(true)}
                  className="text-gray-700 hover:text-blue-600 transition-colors text-sm sm:text-base"
                >
                  <span className="font-semibold">
                    {user?.followings.length}
                  </span>{" "}
                  following
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  onClick={updateProfileHandler}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors shadow-md text-sm sm:text-base"
                >
                  Update Profile
                </button>
                <button
                  onClick={logoutUser}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors shadow-md text-sm sm:text-base"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Password Update Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <button
            onClick={() => setShowUpdatePass(!showUpdatePass)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors shadow-md text-sm sm:text-base"
          >
            {showUpdatePass ? "Cancel" : "Update Password"}
          </button>

          {showUpdatePass && (
            <form onSubmit={updatePassword} className="mt-4 sm:mt-6 max-w-md">
              <div className="space-y-3 sm:space-y-4">
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors shadow-md text-sm sm:text-base"
                >
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Posts/Reels Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <button
              onClick={() => setType("post")}
              className={`px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                type === "post"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setType("reel")}
              className={`px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                type === "reel"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Reels
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {type === "post" &&
              (myPosts.length > 0 ? (
                myPosts.map((post) => (
                  <div key={post._id} className="aspect-square">
                    <PostCard type="post" value={post} />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 text-sm sm:text-base lg:text-lg">
                  No posts yet
                </p>
              ))}
            {type === "reel" &&
              (myReels.length > 0 ? (
                myReels.map((reel) => (
                  <div key={reel._id} className="aspect-square">
                    <PostCard type="reel" value={reel} />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 text-sm sm:text-base lg:text-lg">
                  No reels yet
                </p>
              ))}
          </div>
        </div>
      </div>

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

export default Account;