import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="flex justify-between p-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold">MemeVerse 🎭</h1>
      <div className="space-x-4">
      <ThemeToggle />
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/explore" className="hover:text-gray-300">Explore</Link>
        <Link to="/upload" className="hover:text-gray-300">Upload</Link>
        <Link to="/profile" className="hover:text-gray-300">Profile</Link>
      </div>
    </nav>
  );
}
