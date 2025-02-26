import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const [topMemes, setTopMemes] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    // Fetch liked memes from local storage
    const likedMemeIds = Object.keys(localStorage)
      .filter((key) => key.startsWith("meme_likes_"))
      .map((key) => ({
        id: key.replace("meme_likes_", ""),
        likes: parseInt(localStorage.getItem(key) || "0"),
      }));

    // Fetch memes from API storage (if available)
    const apiMemes = JSON.parse(localStorage.getItem("apiMemes") || "[]");

    // Match memes with their like count
    const likedMemes = likedMemeIds
      .map((meme) => ({
        ...apiMemes.find((m) => m.id === meme.id),
        likes: meme.likes,
      }))
      .filter((meme) => meme.url) // Ensure meme exists
      .sort((a, b) => b.likes - a.likes) // Sort by likes
      .slice(0, 10); // Get top 10

    setTopMemes(likedMemes);

    // Fetch user-uploaded memes
    const userMemes = JSON.parse(localStorage.getItem("userMemes") || "[]");

    // Calculate user rankings
    const userScores = userMemes.reduce((acc, meme) => {
      const user = meme.username || "Unknown User";
      acc[user] = (acc[user] || 0) + (parseInt(localStorage.getItem(`meme_likes_${meme.image}`) || "0"));
      return acc;
    }, {});

    const rankedUsers = Object.entries(userScores)
      .map(([username, totalLikes]) => ({ username, totalLikes }))
      .sort((a, b) => b.totalLikes - a.totalLikes)
      .slice(0, 5); // Top 5 users

    setTopUsers(rankedUsers);
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">🏆 Leaderboard</h2>

      {/* Top Memes Section */}
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">🔥 Top 10 Memes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {topMemes.length > 0 ? (
          topMemes.map((meme, index) => (
            <motion.div key={meme.id} className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg shadow-md flex items-center">
              <span className="text-xl font-bold mr-3">#{index + 1}</span>
              <img src={meme.url} alt={meme.name} className="w-16 h-16 object-cover rounded-lg mr-3" />
              <p className="text-gray-900 dark:text-white font-medium">{meme.name}</p>
              <span className="ml-auto text-red-500 font-bold">{meme.likes} ❤️</span>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No liked memes yet!</p>
        )}
      </div>

      {/* Top Users Section */}
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-2">👑 Top 5 Users</h3>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
        {topUsers.length > 0 ? (
          topUsers.map((user, index) => (
            <motion.div key={index} className="flex justify-between p-2 border-b border-gray-300 dark:border-gray-600">
              <span className="font-bold">{index + 1}. {user.username}</span>
              <span className="text-red-500 font-bold">{user.totalLikes} ❤️</span>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No user rankings yet!</p>
        )}
      </div>
    </div>
  );
}
