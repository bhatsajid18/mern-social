import axios from "axios";
import React, { useEffect, useState } from "react";
import { LoadingAnimation } from "./Loading";
import { Link } from "react-router-dom";

const LikeModal = ({ isOpen, onClose, id }) => {
  if (!isOpen) return null;
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchLikes() {
    try {
      const { data } = await axios.get("/api/post/" + id);
      setValue(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLikes();
  }, [id]);

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-80">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Likes</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 text-2xl transition duration-300"
              >
                &times;
              </button>
            </div>
            <div className="flex flex-col space-y-3">
              {value && value.length > 0 ? (
                value.map((e, i) => (
                  <Link
                    className="flex items-center gap-3 p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-300"
                    to={`/user/${e._id}`}
                    key={i}
                  >
                    <span className="text-gray-700 font-medium">{i + 1}.</span>
                    <img
                      className="w-10 h-10 rounded-full border border-gray-300"
                      src={e.profilePic.url}
                      alt=""
                    />
                    <span className="text-gray-800 font-medium">{e.name}</span>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500">No Likes yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LikeModal;
