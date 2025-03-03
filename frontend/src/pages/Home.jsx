import React, { useState } from "react";
import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
import { PostData } from "../context/PostContext";
import { Loading } from "../components/Loading";

const Home = () => {
  const { posts, loading } = PostData();
  const [showAddPost, setShowAddPost] = useState(false);

  const handleToggleAddPost = () => {
    setShowAddPost((prev) => !prev);
  };

  const handlePostAdded = () => {
    setShowAddPost(false); // Hide AddPost after submission
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <button
            className="fixed top-2 right-6 bg-blue-600 text-white w-14 h-14 flex items-center justify-center text-3xl rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
            onClick={handleToggleAddPost}
          >
            {showAddPost ? "✖" : "+"}
          </button>
          {showAddPost ? (
            <AddPost type="post" onPostAdded={handlePostAdded} />
          ) : (
            posts && posts.length > 0 ? (
              posts.map((e) => <PostCard value={e} key={e._id} type="post" />)
            ) : (
              <p>No Post Yet</p>
            )
          )}
        </div>
      )}
    </>
  );
};

export default Home;
