import React, { useEffect, useRef, useState } from "react";
import { BsChatFill, BsThreeDotsVertical } from "react-icons/bs";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import SimpleModal from "./SimpleModal";
import { LoadingAnimation } from "./Loading";
import LikeModal from "./LikeModal";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

const PostCard = ({ type, value, isPlaying }) => {
  const [isLike, setIsLike] = useState(false);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState(value.caption || "");
  const [captionLoading, setCaptionLoading] = useState(false);
  const [comment, setComment] = useState("");

  const { user } = UserData();
  const { likePost, addComment, deletePost, loading, fetchPosts } = PostData();

  const formatDate = format(new Date(value.createdAt), "MMMM do");
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current
          .play()
          .catch((error) => console.error("Playback error", error));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    setIsLike(value.likes.includes(user._id));
  }, [value.likes, user._id]);

  const likeHandler = () => {
    setIsLike(!isLike);
    likePost(value._id);
  };

  const addCommentHandler = (e) => {
    e.preventDefault();
    addComment(value._id, comment, setComment, setShow);
  };

  const deleteHandler = () => {
    deletePost(value._id);
  };

  const editHandler = () => {
    setShowModal(false);
    setShowInput(true);
  };

  async function updateCaption() {
    setCaptionLoading(true);
    try {
      const { data } = await axios.put(`/api/post/${value._id}`, { caption });
      toast.success(data.message);
      fetchPosts();
      setShowInput(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setCaptionLoading(false);
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center pt-3 pb-14">
      <SimpleModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <LikeModal
          isOpen={open}
          onClose={() => setOpen(false)}
          id={value._id}
        />
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={editHandler}
            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Edit
          </button>
          <button
            onClick={deleteHandler}
            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200"
            disabled={loading}
          >
            {loading ? <LoadingAnimation /> : "Delete"}
          </button>
        </div>
      </SimpleModal>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center justify-between">
          <Link
            className="flex items-center space-x-3"
            to={`/user/${value.owner._id}`}
          >
            <img
              src={value.owner.profilePic.url}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-gray-300"
            />

            <div>
              <p className="text-gray-900 font-semibold">{value.owner.name}</p>
              <div className="text-gray-500 text-sm">{formatDate}</div>
            </div>
          </Link>

          {value.owner._id === user._id && (
            <div className="text-gray-500 cursor-pointer">
              <button
                onClick={() => setShowModal(true)}
                className="hover:bg-gray-200 rounded-full p-2 text-2xl text-gray-600 transition duration-200"
              >
                <BsThreeDotsVertical />
              </button>
            </div>
          )}
        </div>

        <div className="mb-4 mt-3">
          {showInput ? (
            <div className="flex gap-2 items-center">
              <input
                className="border border-gray-300 px-2 py-1 rounded-md"
                style={{ width: "150px" }}
                type="text"
                placeholder="Enter Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
              />
              <button
                onClick={updateCaption}
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                disabled={captionLoading}
              >
                {captionLoading ? <LoadingAnimation /> : "Update Caption"}
              </button>
              <button
                className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                onClick={() => setShowInput(false)}
              >
                X
              </button>
            </div>
          ) : (
            <p className="text-gray-800">{value.caption}</p>
          )}
        </div>

        <div className="mb-4 mt-3 rounded-md overflow-hidden">
          {type === "post" ? (
            <img
              src={value.post.url}
              alt=""
              className="w-[400px] object-cover rounded-md"
            />
          ) : (
            <video
              src={value.post.url}
              ref={videoRef}
              alt=""
              className="w-[400px] h-[500px] max-md:h-[250px] object-cover rounded-md"
              autoPlay
              controls
              loop
              muted
            />
          )}
        </div>
        <div className="flex items-center justify-between text-gray-600 mt-3">
          <div className="flex items-center gap-2">
            <span
              onClick={likeHandler}
              className="text-red-500 text-2xl cursor-pointer"
            >
              {isLike ? <IoHeartSharp /> : <IoHeartOutline />}
            </span>
            <button className="hover:underline" onClick={() => setOpen(true)}>
              {value.likes.length} likes
            </button>
          </div>
          <button
            className="flex items-center gap-2 px-2 py-1 hover:bg-gray-200 rounded-md transition"
            onClick={() => setShow(!show)}
          >
            <BsChatFill />
            <span>{value.comments.length} comments</span>
          </button>
        </div>
        {show && (
          <form onSubmit={addCommentHandler} className="flex gap-3 mt-3">
            <input
              type="text"
              className="border border-gray-300 px-3 py-2 rounded-md w-full"
              placeholder="Enter Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              type="submit"
            >
              Add
            </button>
          </form>
        )}

        <hr className="mt-2 mb-2" />
        <p className="text-gray-900 font-semibold">Comments</p>
        <hr className="mt-2 mb-2" />
        <div className="mt-4">
          <div className="max-h-[250px] overflow-auto mt-2 border-t border-gray-200 pt-2">
            {value.comments && value.comments.length > 0 ? (
              value.comments.map((e) => (
                <Comment
                  value={e}
                  key={e._id}
                  user={user}
                  owner={value.owner._id}
                  id={value._id}
                />
              ))
            ) : (
              <p className="text-gray-500">No Comments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Comment = ({ value, user, owner, id }) => {
  const { deleteComment } = PostData();

  const deleteCommentHandler = () => {
    deleteComment(id, value._id);
  };
  return (
    <div className="flex items-center space-x-2 mt-2">
      <Link to={`/user/${value.user._id}`}>
        <img
          src={value.user.profilePic.url}
          className="w-8 h-8 rounded-full"
          alt=""
        />
      </Link>
      <div>
        <p className="text-gray-800 font-semibold">{value.user.name}</p>
        <p className="text-gray-500 text-sm">{value.comment}</p>
      </div>

      {owner === user._id ? (
        ""
      ) : (
        <>
          {value.user._id === user._id && (
            <button onClick={deleteCommentHandler} className="text-red-500">
              <MdDelete />
            </button>
          )}
        </>
      )}

      {owner === user._id && (
        <button onClick={deleteCommentHandler} className="text-red-500">
          <MdDelete />
        </button>
      )}
    </div>
  );
};

export default PostCard;
