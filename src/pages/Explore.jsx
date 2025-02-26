import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { debounce } from "lodash";
import { Link } from "react-router-dom";

const API_URL = "https://api.imgflip.com/get_memes";

export default function Explore() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("trending");
  const [sortBy, setSortBy] = useState("likes");
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView();

  useEffect(() => {
    fetchMemes();
  }, [filter, page]);

  useEffect(() => {
    if (inView) setPage((prev) => prev + 1);
  }, [inView]);

  const fetchMemes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      let fetchedMemes = response.data.data.memes.slice(0, 10);

      if (filter === "classic") {
        fetchedMemes = fetchedMemes.filter((meme) => meme.width > 500);
      } else if (filter === "random") {
        fetchedMemes = fetchedMemes.sort(() => Math.random() - 0.5);
      }

      if (sortBy === "likes") {
        fetchedMemes = fetchedMemes.sort((a, b) => b.width - a.width);
      } else if (sortBy === "date") {
        fetchedMemes = fetchedMemes.reverse();
      }

      setMemes((prev) => (page === 1 ? fetchedMemes : [...prev, ...fetchedMemes]));
    } catch (error) {
      console.error("Error fetching memes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query.toLowerCase());
    }, 300),
    []
  );

  return (
    <div className="p-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meme Explorer 🔍</h2>

      <input
        type="text"
        placeholder="Search memes..."
        className="w-full max-w-md p-2 mb-4 border rounded dark:bg-gray-800 dark:text-white"
        onChange={(e) => handleSearch(e.target.value)}
      />

      <div className="flex justify-center space-x-4 mb-4">
        {["trending", "new", "classic", "random"].map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded ${
              filter === category ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"
            }`}
            onClick={() => {
              setFilter(category);
              setPage(1);
              setMemes([]);
            }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="text-gray-800 dark:text-white mr-2">Sort by:</label>
        <select
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
            setMemes([]);
          }}
        >
          <option value="likes">Most Liked</option>
          <option value="date">Newest</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading && page === 1
          ? [...Array(6)].map((_, i) => (
              <motion.div key={i} className="bg-gray-300 dark:bg-gray-700 animate-pulse h-48 rounded-lg"></motion.div>
            ))
          : memes
              .filter((meme) => meme.name.toLowerCase().includes(searchQuery))
              .map((meme) => (
                <Link key={meme.id} to={`/meme/${meme.id}`} state={{ meme }}>
                  <motion.div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 shadow-md" whileHover={{ scale: 1.05 }}>
                    <img src={meme.url} alt={meme.name} className="w-full h-48 object-cover rounded-lg" loading="lazy"/>
                    <p className="mt-2 text-gray-900 dark:text-white font-medium">{meme.name}</p>
                  </motion.div>
                </Link>
              ))}
      </div>

      {loading && page > 1 && <p className="text-gray-600 dark:text-gray-400 mt-4">Loading more memes...</p>}
      <div ref={ref}></div>
    </div>
  );
}
