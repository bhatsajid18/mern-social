import React from "react";
import { Link } from "react-router-dom";

const Modal = ({ value, title, setShow }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl w-[350px] max-h-[400px] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-semibold text-blue-600">{title}</h1>
          <button
            onClick={() => setShow(false)}
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
                onClick={() => setShow(false)}
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
            <p className="text-center text-gray-500">No {title} yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
