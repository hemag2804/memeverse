import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartIcon, ShareIcon } from "@heroicons/react/24/solid";

export default function MemeDetail() {
  const { id } = useParams();
  const location = useLocation();
  const meme = location.state?.meme; // Retrieve meme details from state
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!meme) return;

    setLikes(parseInt(localStorage.getItem(`meme_likes_${id}`)) || 0);
    setComments(JSON.parse(localStorage.getItem(`meme_comments_${id}`) || "[]"));
  }, [id, meme]);

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    localStorage.setItem(`meme_likes_${id}`, newLikes);
  
    // Store API memes for leaderboard
    const apiMemes = JSON.parse(localStorage.getItem("apiMemes") || "[]");
    if (!apiMemes.find((m) => m.id === meme.id)) {
      localStorage.setItem("apiMemes", JSON.stringify([...apiMemes, meme]));
    }
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() === "") return;
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem(`meme_comments_${id}`, JSON.stringify(updatedComments));
    setNewComment("");
  };

  const shareMeme = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    alert("Meme link copied to clipboard! 📋");
  };

  if (!meme) return <p className="text-center text-gray-500 dark:text-gray-400">Meme not found!</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <motion.div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <img src={meme.url} alt="Meme" className="w-full h-60 object-cover rounded-lg" />
        <p className="mt-2 text-gray-900 dark:text-white font-medium">{meme.name}</p>
      </motion.div>

      <div className="flex justify-between mt-4">
        <button className="flex items-center text-red-500" onClick={handleLike}>
          <HeartIcon className="w-6 h-6 mr-1" /> {likes} Likes
        </button>

        <button className="flex items-center text-blue-500" onClick={shareMeme}>
          <ShareIcon className="w-6 h-6 mr-1" /> Share
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Comments</h3>
        <input type="text" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." />
        <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded" onClick={handleCommentSubmit}>Post Comment</button>

        <ul className="mt-4 space-y-2">
          {comments.map((comment, index) => <li key={index} className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-left">{comment}</li>)}
        </ul>
      </div>
    </div>
  );
}
