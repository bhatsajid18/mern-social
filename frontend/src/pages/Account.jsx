import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowDownLong, FaArrowUp, FaPlus } from "react-icons/fa6";
import Modal from "../components/Modal";
import axios from "axios";
import { Loading } from "../components/Loading";
import { CiEdit } from "react-icons/ci";
import toast from "react-hot-toast";
import { IoCloseCircleOutline } from "react-icons/io5";

const Account = ({ user }) => {
  const navigate = useNavigate();
  const { logoutUser, updateProfilePic, updateProfileName } = UserData();
  const { posts, reels, loading } = PostData();

  let myPosts = posts
    ? posts.filter((post) => post.owner._id === user._id)
    : [];
  let myReels = reels
    ? reels.filter((reel) => reel.owner._id === user._id)
    : [];

  const [type, setType] = useState("post");
  const [file, setFile] = useState(null);
  const [name, setName] = useState(user.name || "");
  const [showInput, setShowInput] = useState(false);

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  useEffect(() => {
    async function followData() {
      try {
        const { data } = await axios.get("/api/user/followdata/" + user._id);
        setFollowersData(data.followers);
        setFollowingsData(data.followings);
      } catch (error) {
        console.log(error);
      }
    }
    followData();
  }, [user]);

  const changeFileHandler = (e) => {
    setFile(e.target.files[0]);
  };

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

  const [showUpdatePass, setShowUpdatePass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function updatePassword(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/" + user._id, {
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

  return (
    <div className="bg-gray-100 min-h-[110vh] flex flex-col gap-8 items-center py-12 px-4">
      {loading ? (
        <Loading />
      ) : (
        <>
          {user && (
            <>
              <div
                className={`bg-white flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl shadow-xl max-w-xl  md:max-w-3xl ${
                  showInput ? "w-120" : "w-100"
                }`}
              >
                {show && (
                  <Modal
                    value={followersData}
                    title="Followers"
                    setShow={setShow}
                  />
                )}
                {show1 && (
                  <Modal
                    value={followingsData}
                    title="Followings"
                    setShow={setShow1}
                  />
                )}

                <div className="relative flex flex-col items-center gap-4">
                  <img
                    src={user.profilePic.url}
                    alt="Profile"
                    className="w-36 h-36 rounded-full border-4 border-gray-300 shadow-md"
                  />
                  <label
                    htmlFor="fileInput"
                    className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-full cursor-pointer"
                  >
                    <FaPlus />
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    onChange={changeFileHandler}
                  />
                </div>

                <div className="flex flex-col gap-3 text-center md:text-left">
                  {showInput ? (
                    <div className="flex gap-3 items-center">
                      <input
                        className="border rounded-lg px-3 py-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Name"
                        required
                      />
                      {/* <button
                        onClick={updateProfileHandler}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg"
                      >
                        Update
                      </button> */}
                      <button
                        onClick={() => setShowInput(false)}
                        // className="bg-red-500 text-white p-2 rounded-full"
                      >
                        {/* X */}
                        <IoCloseCircleOutline />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xl font-semibold">
                      {user.name}{" "}
                      <button onClick={() => setShowInput(true)}>
                        <CiEdit />
                      </button>
                    </p>
                  )}
                  <p className="text-gray-700">{user.email}</p>
                  {/* <p className="text-gray-700">{user.gender}</p> */}
                  <p
                    className="text-gray-700 cursor-pointer hover:text-blue-600"
                    onClick={() => setShow(true)}
                  >
                    {user.followers.length} followers
                  </p>
                  <p
                    className="text-gray-700 cursor-pointer hover:text-blue-600"
                    onClick={() => setShow1(true)}
                  >
                    {user.followings.length} following
                  </p>
                  <button
                    onClick={updateProfileHandler}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Update Profile
                  </button>

                  <button
                    onClick={logoutUser}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* <div>
                <button
                  onClick={() => setShowUpdatePass(!showUpdatePass)}
                  className="bg-blue-500 px-2 py-1 rounded-sm text-white"
                >
                  {showUpdatePass ? "X" : "Update Password"}
                </button>
                {showUpdatePass && (
                  <form
                    onSubmit={updatePassword}
                    className="flex flex-col bg-white p-2 rounded-sm gap-4"
                  >
                    <input
                      type="password"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 px-2 py-1 rounded-sm text-white"
                    >
                      Update Password
                    </button>
                  </form>
                )}
              </div> */}

              <div className="flex flex-col items-center justify-center p-4">
                <button
                  onClick={() => setShowUpdatePass(!showUpdatePass)}
                  className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 px-4 py-2 rounded-md text-white font-medium shadow-md"
                >
                  {showUpdatePass ? "X" : "Update Password"}
                </button>

                {showUpdatePass && (
                  <form
                    onSubmit={updatePassword}
                    className="flex flex-col bg-white p-4 mt-4 rounded-md shadow-lg border border-gray-200 w-80"
                  >
                    <input
                      type="password"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2"
                    />

                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-4 py-2 rounded-md text-white font-medium mt-4 shadow-md"
                    >
                      Update Password
                    </button>
                  </form>
                )}
              </div>

              <div className="controls flex justify-center items-center bg-white p-4 rounded-md gap-7">
                <button onClick={() => setType("post")}>Posts</button>
                <button onClick={() => setType("reel")}>Reels</button>
              </div>

              <div className="w-full max-w-xl">
                {type === "post" &&
                  (myPosts.length > 0 ? (
                    myPosts.map((e) => (
                      <PostCard type="post" value={e} key={e._id} />
                    ))
                  ) : (
                    <p className="text-center text-gray-600 text-lg">
                      No Post Yet
                    </p>
                  ))}
                {type === "reel" &&
                  (myReels.length > 0 ? (
                    myReels.map((e) => (
                      <PostCard type="reel" value={e} key={e._id} />
                    ))
                  ) : (
                    <p className="text-center text-gray-600 text-lg">
                      No Reels Yet
                    </p>
                  ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Account;
