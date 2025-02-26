import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="flex justify-between p-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold">MemeVerse 🎭</h1>
      <div className="flex space-x-6">
        {["/", "/explore", "/upload", "/profile", "/leaderboard"].map((path) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `hover:text-gray-300 ${isActive ? "text-yellow-400" : ""}`
            }
          >
            {path === "/" ? "Home" : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
          </NavLink>
        ))}
        <ThemeToggle />
      </div>
    </nav>
  );
}
