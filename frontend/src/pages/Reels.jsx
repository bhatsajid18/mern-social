// import React, { useState } from "react";
// import AddPost from "../components/AddPost";
// import { PostData } from "../context/PostContext";
// import PostCard from "../components/PostCard";
// import { FaArrowUp, FaArrowDownLong } from "react-icons/fa6";
// import { Loading } from "../components/Loading";

// const Reels = () => {
//   const { reels, loading } = PostData();
//   const [index, setIndex] = useState(0);

//   const prevReel = () => {
//     if (index === 0) {
//       console.log("null");
//       return null;
//     }
//     setIndex(index - 1);
//   };
//   const nextReel = () => {
//     if (index === reels.length - 1) {
//       console.log("null");
//       return null;
//     }
//     setIndex(index + 1);
//   };
//   return (
//     <>
//       {loading ? (
//         <Loading />
//       ) : (
//         <div className="bg-gray-100">
//           <AddPost type="reel" />
//           <div className="flex m-auto gap-3 w-[300px] md:w-[500px]">
//             {reels && reels.length > 0 ? (
//               <PostCard
//                 key={reels[index]._id}
//                 value={reels[index]}
//                 type={"reel"}
//               />
//             ) : (
//               <p>No reels yet</p>
//             )}
//             <div className="button flex flex-col justify-center items-center gap-6">
//               {index === 0 ? (
//                 ""
//               ) : (
//                 <button
//                   className="bg-gray-500 text-white py-5 px-5 rounded-full"
//                   onClick={prevReel}
//                 >
//                   <FaArrowUp />
//                 </button>
//               )}
//               {index === reels.length - 1 ? (
//                 ""
//               ) : (
//                 <button
//                   className="bg-gray-500 text-white py-5 px-5 rounded-full"
//                   onClick={nextReel}
//                 >
//                   <FaArrowDownLong />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Reels;


import React, { useState } from "react";
import AddPost from "../components/AddPost";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowUp, FaArrowDownLong } from "react-icons/fa6";
import { Loading } from "../components/Loading";

const Reels = () => {
  const { reels, loading } = PostData();
  const [index, setIndex] = useState(0);
  const [showAddPost, setShowAddPost] = useState(false);

  const prevReel = () => {
    if (index > 0) setIndex(index - 1);
  };
  
  const nextReel = () => {
    if (index < reels.length - 1) setIndex(index + 1);
  };
  
  const handleToggleAddPost = () => {
    setShowAddPost((prev) => !prev);
  };

  const handlePostAdded = () => {
    setShowAddPost(false);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="bg-gray-100">
          <button
            className="fixed top-2 right-6 bg-blue-600 text-white w-14 h-14 flex items-center justify-center text-3xl rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
            onClick={handleToggleAddPost}
          >
            {showAddPost ? "✖" : "+"}
          </button>
          {showAddPost ? (
            <AddPost type="reel" onPostAdded={handlePostAdded} />
          ) : (
            <div className="flex m-auto gap-3 w-[300px] md:w-[500px]">
              {reels && reels.length > 0 ? (
                <PostCard
                  key={reels[index]._id}
                  value={reels[index]}
                  type={"reel"}
                />
              ) : (
                <p className="text-center text-gray-500 text-lg mt-10 font-semibold italic bg-gray-200 p-4 rounded-lg shadow-md">📹 No reels yet. Be the first to share one! 🎬</p>
              )}
              <div className="button flex flex-col justify-center items-center gap-6">
                {index > 0 && (
                  <button
                    className="bg-gray-500 text-white py-5 px-5 rounded-full"
                    onClick={prevReel}
                  >
                    <FaArrowUp />
                  </button>
                )}
                {index < reels.length - 1 && (
                  <button
                    className="bg-gray-500 text-white py-5 px-5 rounded-full"
                    onClick={nextReel}
                  >
                    <FaArrowDownLong />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Reels;
