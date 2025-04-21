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

  return (
    <main className="flex flex-col row-start-2 items-center sm:items-start">
      <div className="border p-4 rounded-2xl shadow-xl mt-15 mb-20 ml-30 mr-30 p-20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block font-bold">Date of Run:</label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            className="border p-2 rounded max-w-2xl mb-5"
            required
          />
          <label className="block font-bold">Run Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-[600px] mt-1 mb-5"
            required
          />
          <label className="block font-bold">Run Goal:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-[600px] mt-1 mb-5"
            rows="5"
            required
          />
          <button
            type="submit"
            className="bg-amber-600 text-white font-bold p-4 rounded-full text-2xl shadow-lg cursor-pointer w-[175px] mx-auto"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </main>
  );
}