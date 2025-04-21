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

  if (!params || !title || !description) return <p>Loading...</p>;

  return (
    <main className="flex flex-col row-start-2 items-center sm:items-start">
      <div className="border p-4 rounded-2xl shadow-xl mt-15 mb-20 ml-30 mr-30 p-20">
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
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
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </main>
  );
}