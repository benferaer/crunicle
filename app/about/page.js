'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserAuth } from "../_utils/auth-context"; // Import your user authentication context

export default function About() {
  const router = useRouter();
  const { user, firebaseSignOut } = useUserAuth(); // Access user and sign-out function from context
  const [menuOpen, setMenuOpen] = useState(false); // State for dropdown menu

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(); // Sign out the user
      router.push("/"); // Redirect to homepage after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
    {/* Header */}
    <header className="bg-gray-800 shadow-md p-4 flex items-center justify-between">
    {/* Website Name */}
    <h1
      className="text-3xl font-bold text-amber-500 italic cursor-pointer"
      onClick={() => router.push("/")} // Navigate back to the homepage
    >
      cRUNicle
    </h1>

    {/* User Menu */}
    {user && (
      <div className="relative">
        {/* Menu Button */}
        <button
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-200"
          onClick={() => setMenuOpen((prev) => !prev)} // Toggle menu visibility
        >
          {user.displayName || "User"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <ul className="py-2">
              <li>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-amber-400 transition duration-200"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    )}
  </header>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6">
      

      {/* About Section */}
      <section className="max-w-4xl mx-auto mt-10 bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-amber-400 mb-4">About cRUNicle</h2>
        <p className="text-lg text-gray-300 leading-relaxed">
          cRUNicle is a personalized running journal app designed to help beginner runners like myself stay motivated, organized, and consistent in building a running habit. Recognizing the challenges that come with starting a new fitness routine, cRUNicle offers a simple and intuitive platform to plan out weekly running schedules, set achievable goals, and track progress over time.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed mt-4">
          Whether you're just starting your running journey or looking for a way to stay on track, cRUNicle is here to support you every step of the way. Let's make running a part of your life, one step at a time.
        </p>
      </section>
    </div>
    </>
  );
}