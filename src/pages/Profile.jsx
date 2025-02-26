import { useState, useEffect } from "react";

export default function Profile() {
  const [userMemes, setUserMemes] = useState([]);

  useEffect(() => {
    const storedMemes = JSON.parse(localStorage.getItem("userMemes") || "[]");
    setUserMemes(storedMemes);
  }, []);

  return (
    <div className="p-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Uploaded Memes 🎭</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {userMemes.length > 0 ? (
          userMemes.map((meme, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 shadow-md">
              <img src={meme.image} alt="Uploaded Meme" className="w-full h-48 object-cover rounded-lg" />
              <p className="mt-2 text-gray-900 dark:text-white font-medium">{meme.caption}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No memes uploaded yet!</p>
        )}
      </div>
    </div>
  );
}
