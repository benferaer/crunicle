'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db, updateRun } from "../../_utils/firebase"; // Adjusted path to firebase.js
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EditRun({ params: paramsPromise }) {
  const router = useRouter();
  const [params, setParams] = useState(null); // State to store unwrapped params
  const [date, setDate] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Unwrap the params Promise
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await paramsPromise;
      setParams(resolvedParams);
    };

    unwrapParams();
  }, [paramsPromise]);

  // Fetch the run data when params are available
  useEffect(() => {
    if (!params) return;

    const fetchRun = async () => {
      try {
        const docRef = doc(db, "runs", params.id); // Use unwrapped params
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const runData = docSnap.data();
          setDate(runData.date.toDate()); // Convert Firestore timestamp to JS Date
          setTitle(runData.title);
          setDescription(runData.description);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching run:", error);
      }
    };

    fetchRun();
  }, [params]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedData = {
        date,
        title,
        description,
      };
      await updateRun(params.id, updatedData); // Use unwrapped params
      console.log("Run updated successfully!");
      router.push("/"); // Navigate back to the homepage
    } catch (error) {
      console.error("Error updating run:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/"); // Navigate back to the homepage
  };

  if (!params || !title || !description) return <p>Loading...</p>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="border border-gray-600 bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-amber-500">Edit Your Run</h1>
        <form onSubmit={handleUpdate} className="flex flex-col gap-6">
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
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}