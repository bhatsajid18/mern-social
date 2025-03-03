import React, { useState } from "react";
import { PostData } from "../context/PostContext";
import { LoadingAnimation } from "./Loading";

const AddPost = ({ type, onPostAdded }) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState("");
  const [filePrev, setFilePrev] = useState("");

  const { addPost, addLoading } = PostData();

  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setFilePrev(reader.result);
      setFile(file);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formdata = new FormData();

    formdata.append("caption", caption);
    formdata.append("file", file);
    try {
      await addPost(formdata, setFile, setCaption, setFilePrev, type);
      await onPostAdded(); // Trigger the callback after successful post addition
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-[90vh] py-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-5 items-center"
        >
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <input
            type="file"
            className="w-full p-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
            accept={type === "post" ? "image/*" : "video/*"}
            onChange={changeFileHandler}
            required
          />
          {filePrev && (
            <div className="w-full flex justify-center">
              {type === "post" ? (
                <img
                  src={filePrev}
                  alt="Preview"
                  className="max-w-full h-auto rounded-md shadow-md"
                />
              ) : (
                <video
                  controlsList="nodownload"
                  controls
                  src={filePrev}
                  className="w-full max-h-[400px] rounded-md shadow-md"
                />
              )}
            </div>
          )}
          <button
            disabled={addLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
          >
            {addLoading ? (
              <LoadingAnimation />
            ) : type === "post" ? (
              "+ Add Post"
            ) : (
              "+ Add Reel"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
