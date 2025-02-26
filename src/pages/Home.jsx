import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL = "https://api.imgflip.com/get_memes";

export default function Home() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMemes() {
      try {
        const response = await axios.get(API_URL);
        setMemes(response.data.data.memes.slice(0, 10));
      } catch (error) {
        console.error("Error fetching memes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMemes();
  }, []);

  return (
    <div className="p-6 text-center">
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome to MemeVerse 🎭
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Explore, create, and share your favorite memes!
        </p>
      </motion.div>

      {/* Trending Memes */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">🔥 Trending Memes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading
          ? [...Array(6)].map((_, i) => (
              <motion.div key={i} className="bg-gray-300 dark:bg-gray-700 animate-pulse h-48 rounded-lg"></motion.div>
            ))
          : memes.map((meme) => (
              <motion.div key={meme.id} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 shadow-md" whileHover={{ scale: 1.05 }}>
                <img src={meme.url} alt={meme.name} className="w-full h-48 object-cover rounded-lg" />
                <p className="mt-2 text-gray-900 dark:text-white font-medium">{meme.name}</p>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
