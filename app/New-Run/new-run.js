'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function NewRun() {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRunData = { date, title, description };
    console.log('New Run Data:', newRunData);
    setSubmittedData(newRunData);
    // You can add logic here to send the data to a server or API
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
            className="border p-2 rounded w-[600px] mt-1 mb-5" // Adjusted width
            rows="5"
            required
          />
          <button type="submit" className="bg-amber-600 text-white font-bold p-4 rounded-full text-2xl shadow-lg cursor-pointer w-[175px] mx-auto">
            Submit
          </button>
        </form>
      </div>
      {submittedData && (
        <div className="mt-4">
          <h2>Submitted Data:</h2>
          <p><strong>Date:</strong> {submittedData.date}</p>
          <p><strong>Description:</strong> {submittedData.description}</p>
        </div>
      )}
    </main>
  );
}