import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { debounce } from "lodash";

const API_URL = "https://api.imgflip.com/get_memes"; // Meme API

export default function Explore() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("trending");
  const [sortBy, setSortBy] = useState("likes");
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView(); // Detect when user scrolls to bottom

  useEffect(() => {
    fetchMemes();
  }, [filter, page]); // Fetch memes when filter or page changes

  useEffect(() => {
    if (inView) setPage((prev) => prev + 1); // Load more memes when bottom is reached
  }, [inView]);

  // Fetch memes from API
  const fetchMemes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      let fetchedMemes = response.data.data.memes.slice(0, 10);

      // Apply filters
      if (filter === "classic") {
        fetchedMemes = fetchedMemes.filter((meme) => meme.width > 500);
      } else if (filter === "random") {
        fetchedMemes = fetchedMemes.sort(() => Math.random() - 0.5);
      }

      // Apply sorting
      if (sortBy === "likes") {
        fetchedMemes = fetchedMemes.sort((a, b) => b.width - a.width);
      } else if (sortBy === "date") {
        fetchedMemes = fetchedMemes.reverse(); // Assuming newer memes are last
      }

      setMemes((prev) => (page === 1 ? fetchedMemes : [...prev, ...fetchedMemes]));
    } catch (error) {
      console.error("Error fetching memes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query.toLowerCase());
    }, 300),
    []
  );

  return (
    <div className="p-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Meme Explorer 🔍
      </h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search memes..."
        className="w-full max-w-md p-2 mb-4 border rounded dark:bg-gray-800 dark:text-white"
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* Filters */}
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
              setMemes([]); // Reset memes when changing filter
            }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Sorting */}
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

      {/* Meme Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading && page === 1
          ? [...Array(6)].map((_, i) => (
              <motion.div key={i} className="bg-gray-300 dark:bg-gray-700 animate-pulse h-48 rounded-lg"></motion.div>
            ))
          : memes
              .filter((meme) => meme.name.toLowerCase().includes(searchQuery))
              .map((meme) => (
                <motion.div
                  key={meme.id}
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={meme.url}
                    alt={meme.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-gray-900 dark:text-white font-medium">
                    {meme.name}
                  </p>
                </motion.div>
              ))}
      </div>

      {/* Infinite Scroll Loader */}
      {loading && page > 1 && (
        <p className="text-gray-600 dark:text-gray-400 mt-4">Loading more memes...</p>
      )}
      <div ref={ref}></div>
    </div>
  );
}
