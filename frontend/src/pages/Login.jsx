import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { loginUser, loading } = UserData();
  const { fetchPosts } = PostData();

  const submitHandler = (e) => {
    e.preventDefault();
    loginUser(email, password, navigate, fetchPosts);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="bg-white p-8 rounded-md shadow-md w-[350px]">
          <h1 className="text-center text-3xl font-bold mb-6">Snapgram</h1>
          <form onSubmit={submitHandler} className="flex flex-col space-y-4">
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
            <button className="bg-blue-500 text-white py-2 rounded-md font-semibold">
              Login
            </button>
          </form>
          <div className="text-center mt-4 text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500">
              Sign up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
