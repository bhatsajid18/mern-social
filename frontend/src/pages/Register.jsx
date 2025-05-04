import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [file, setFile] = useState("");
  const [filePrev, setFilePrev] = useState("");

  const { registerUser, loading } = UserData();
  const { fetchPosts } = PostData();

  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setFilePrev(reader.result);
      setFile(file);
    };
  };

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    const formdata = new FormData();

    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("gender", gender);
    formdata.append("file", file);

    registerUser(formdata, navigate, fetchPosts);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {loading ? (
        <h1>Loading....</h1>
      ) : (
        <div className="bg-white p-8 rounded-md shadow-md w-[350px]">
          <h1 className="text-center text-3xl font-bold mb-6">Chime</h1>
          <form onSubmit={submitHandler} className="flex flex-col space-y-4">
            {filePrev && (
              <img
                src={filePrev}
                className="w-[80px] h-[80px] mx-auto rounded-full"
                alt="Profile"
              />
            )}
            <input
              type="file"
              className="border px-3 py-2 rounded-md focus:outline-none"
              onChange={changeFileHandler}
              accept="image/*"
              required
            />
            <input
              type="text"
              className="border px-3 py-2 rounded-md focus:outline-none"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              className="border px-3 py-2 rounded-md focus:outline-none"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="border px-3 py-2 rounded-md focus:outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <select
              className="border px-3 py-2 rounded-md focus:outline-none"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <button className="bg-blue-500 text-white py-2 rounded-md font-semibold">
              Sign Up
            </button>
          </form>
          <div className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
