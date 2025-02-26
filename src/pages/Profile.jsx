import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("uploads");
  const [userMemes, setUserMemes] = useState([]);
  const [likedMemes, setLikedMemes] = useState([]);
  const [profile, setProfile] = useState({
    avatar: "https://via.placeholder.com/100", // Default avatar
    name: "Meme Master",
    bio: "Just a meme lover 😆",
  });

  useEffect(() => {
    const storedMemes = JSON.parse(localStorage.getItem("userMemes") || "[]");
    setUserMemes(storedMemes);

    const likedMemeIds = Object.keys(localStorage)
      .filter((key) => key.startsWith("meme_likes_"))
      .map((key) => key.replace("meme_likes_", ""));

    const apiMemes = JSON.parse(localStorage.getItem("apiMemes") || "[]");
    const liked = apiMemes.filter((meme) => likedMemeIds.includes(meme.id));
    setLikedMemes(liked);

    const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (storedProfile) setProfile(storedProfile);
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <motion.div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <img src={profile.avatar} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
        <p className="text-gray-600 dark:text-gray-400">{profile.bio}</p>
        <button onClick={() => setActiveTab("edit")} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg">
          Edit Profile ✏️
        </button>
      </motion.div>

      <div className="mt-6 flex justify-center space-x-4">
        <button onClick={() => setActiveTab("uploads")} className={`px-4 py-2 rounded ${activeTab === "uploads" ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"}`}>
          My Uploads
        </button>
        <button onClick={() => setActiveTab("liked")} className={`px-4 py-2 rounded ${activeTab === "liked" ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"}`}>
          Liked Memes
        </button>
      </div>

      {activeTab === "uploads" && <MemeGrid memes={userMemes} message="You haven't uploaded any memes yet!" />}
      {activeTab === "liked" && <MemeGrid memes={likedMemes} message="You haven't liked any memes yet!" />}
      {activeTab === "edit" && <EditProfile profile={profile} setProfile={setProfile} />}
    </div>
  );
}

// Component to display memes in a grid
function MemeGrid({ memes, message }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {memes.length > 0 ? (
        memes.map((meme, index) => (
          <motion.div key={index} className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg shadow-md">
            <img src={meme.image || meme.url} alt="Meme" className="w-full h-48 object-cover rounded-lg" />
            <p className="mt-2 text-gray-900 dark:text-white">{meme.caption || meme.name}</p>
          </motion.div>
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
}

// **Edit Profile Component**
function EditProfile({ profile, setProfile }) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);

  const handleSave = () => {
    const updatedProfile = { name, bio, avatar };
    setProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };

  return (
    <motion.div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h3>

      <input type="text" placeholder="Your Name" className="w-full p-2 mt-2 border rounded dark:bg-gray-700 dark:text-white" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea placeholder="Your Bio" className="w-full p-2 mt-2 border rounded dark:bg-gray-700 dark:text-white" value={bio} onChange={(e) => setBio(e.target.value)} />
      <input type="text" placeholder="Profile Picture URL" className="w-full p-2 mt-2 border rounded dark:bg-gray-700 dark:text-white" value={avatar} onChange={(e) => setAvatar(e.target.value)} />

      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleSave}>
        Save Changes ✅
      </button>
    </motion.div>
  );
}
