'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addNewRun } from "../_utils/firebase"; // Import the addNewRun function
import { useUserAuth } from "../_utils/auth-context"; // Import user authentication context
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function NewRun() {
  const { user } = useUserAuth(); // Get the logged-in user
  const router = useRouter(); // Initialize the router
  const [date, setDate] = useState(null); // Use null for DatePicker compatibility
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false); // To handle loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error("User is not logged in.");
      return;
    }

    setLoading(true); // Start loading
    const newRunData = {
      date,
      title,
      description,
      userId: user.uid, // Associate the run with the logged-in user
    };

    try {
      const docId = await addNewRun(newRunData); // Call the Firebase function
      console.log("Run added with ID:", docId);

      // Navigate back to the homepage after successful submission
      router.push("/"); // Navigate to the homepage
    } catch (error) {
      console.error("Error adding run:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleCancel = () => {
    router.push("/"); // Navigate back to the homepage
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="border border-gray-600 bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-amber-500">Create a New Run</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Date Picker */}
          <div>
            <label className="block font-bold text-lg mb-2">Date of Run:</label>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              className="border border-gray-500 bg-gray-700 text-white p-3 rounded w-full"
              required
            />
          </div>

          {/* Run Title */}
          <div>
            <label className="block font-bold text-lg mb-2">Run Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-500 bg-gray-700 text-white p-3 rounded w-full"
              placeholder="Enter the title of your run"
              required
            />
          </div>

          {/* Run Goal */}
          <div>
            <label className="block font-bold text-lg mb-2">Run Goal:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-500 bg-gray-700 text-white p-3 rounded w-full"
              rows="5"
              placeholder="Describe your goal for this run"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleCancel} // Call the handleCancel function
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transition duration-200"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}