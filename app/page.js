'use client';

import { useUserAuth } from "./_utils/auth-context";
import { format, addDays, isSameMonth } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchUserRuns, deleteRun } from "./_utils/firebase";
import fetchWeatherData from "./weatherApi/weather";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Page() {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();
  const router = useRouter();

  const [currentWeekStart, setCurrentWeekStart] = useState(new Date()); // Start with today
  const [runs, setRuns] = useState([]); // Store fetched runs
  const [weatherData, setWeatherData] = useState(null); // Store weather data
  const [loading, setLoading] = useState(false); // To handle loading state

  const handleSignIn = async () => {
    try {
      await gitHubSignIn(); // Trigger GitHub sign-in
      console.log("Sign-in triggered. Waiting for user object to update...");
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log(`User UID: ${user.uid}`); // Log the UID when the user object updates
    }
  }, [user]); // Run this effect whenever the `user` object changes

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleNewRunClick = () => {
    router.push("/New-Run"); // Navigate to the new-run page
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, -7)); // Move to the previous week
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7)); // Move to the next week
  };

  // Generate days for the current week
  const generateWeekDays = (startDate) => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startDate, i);
      return {
        day: format(date, "EEEEE"), // First letter of the day (e.g., S for Sunday)
        date: format(date, "yyyy-MM-dd"), // Full date in ISO format
        displayDate: format(date, "d"), // Day number (e.g., 18)
        month: format(date, "MMMM"), // Month name (e.g., April)
        isCurrentMonth: isSameMonth(date, startDate), // Check if the day is in the current month
      };
    });
  };

  const thisWeek = generateWeekDays(currentWeekStart);

  // Fetch runs and weather data
  useEffect(() => {
    const getData = async () => {
      if (user) {
        try {
          const userRuns = await fetchUserRuns(user.uid);
          setRuns(userRuns);

          const weather = await fetchWeatherData();
          setWeatherData(weather.forecast.forecastday); // Store weather forecast data
          console.log("Weather data:", weather.forecast);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    getData();
  }, [user]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this run?")) {
      return; // Exit if the user cancels the confirmation
    }

    setLoading(true); // Start loading
    try {
      await deleteRun(run.id); // Call the deleteRun function
      console.log(`Run with ID ${run.id} deleted successfully.`);
      // Optionally, refresh the data or remove the run from the UI
    } catch (error) {
      console.error("Error deleting run:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <main className="p-4">
      {user ? (
        <>
          <h1 className="text-2xl font-bold mb-4">
            Welcome, {user.displayName} ({user.email})
          </h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white p-2 rounded mb-4"
          >
            Sign Out
          </button>

          {/* Week Navigation */}
          <div className="flex gap-4 items-center mb-4">
            <button
              onClick={handlePreviousWeek}
              className=" text-white p-3 rounded-full font-bold hover:bg-gray-500 hover:scale-110 transition-transform duration-200 cursor-pointer"
            >
              <ChevronLeftIcon className="h-6 w-6" /> {/* Left arrow icon */}
            </button>
            <h2 className="text-4xl mb-2 font-bold">{thisWeek[0].month}</h2>
            <button
              onClick={handleNextWeek}
              className=" text-white p-3 rounded-full font-bold hover:bg-gray-500 hover:scale-110 transition-transform duration-200 cursor-pointer"
            >
              <ChevronRightIcon className="h-6 w-6" /> {/* Right arrow icon */}
            </button>
          </div>

          {/* Week Days in Rows */}
          <section className="border rounded p-4">
            {thisWeek.map((day, index) => (
              <div
                key={index}
                className={`flex items-start border-b py-2 h-[300px] ${
                  day.isCurrentMonth ? "text-white" : "text-gray-400"
                }`}
              >
                {/* Date Column */}
                <div className="flex-shrink-0 w-16 flex flex-col items-center justify-center my-auto">
                  <span className="font-bold text-5xl mb-2 ml-5">{day.day}</span>
                  <span className="text-2xl ml-5">{day.displayDate}</span>
                </div>

                {/* Runs Column */}
                <div className="flex-grow ml-10 flex flex-wrap justify-center my-auto gap-15 ">
                  {runs.filter((run) => run.date === day.date).length > 0 ? (
                    runs
                      .filter((run) => run.date === day.date) // Match runs to the current date
                      .map((run) => {
                        const weatherForDay = weatherData?.find(
                          (weather) =>
                            format(new Date(weather.date), "yyyy-MM-dd") ===
                            run.date
                        );

                        return (
                          <div
                            key={run.id}
                            className="relative bg-gray-800 text-white p-6 rounded-3xl shadow-lg w-[400px] flex flex-col gap-4 cursor-pointer hover:shadow-xl transition-shadow"
                            onClick={() => router.push(`/Edit-Run/${run.id}`)} // Navigate to the Edit-Run page with the run ID
                          >
                            {/* Badge */}
                            {weatherForDay && (
                              <div
                                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${
                                  weatherForDay.day.avgtemp_c > 10 && weatherForDay.day.avgtemp_c < 20
                                    ? "bg-green-500 text-white"
                                    : weatherForDay.day.avgtemp_c >= 20 && weatherForDay.day.avgtemp_c < 27
                                    ? "bg-orange-500 text-white"
                                    : weatherForDay.day.avgtemp_c >= 0 && weatherForDay.day.avgtemp_c <= 10
                                    ? "bg-blue-300 text-black"
                                    : "bg-gray-500 text-white"
                                }`}
                              >
                                {weatherForDay.day.avgtemp_c > 10 && weatherForDay.day.avgtemp_c < 20
                                  ? "Good Day for a Run"
                                  : weatherForDay.day.avgtemp_c >= 20 && weatherForDay.day.avgtemp_c < 27
                                  ? "May Be a Bit Hot"
                                  : weatherForDay.day.avgtemp_c >= 0 && weatherForDay.day.avgtemp_c <= 10
                                  ? "May Be Chilly"
                                  : "No Data"}
                              </div>
                            )}

                            {/* Trash Icon */}
                            <button
                              onClick={async (e) => {
                                e.stopPropagation(); // Prevent triggering the card click event
                                if (!window.confirm("Are you sure you want to delete this run?")) return;
                                setLoading(true);
                                try {
                                  await deleteRun(run.id); // Call the deleteRun function
                                  console.log(`Run with ID ${run.id} deleted successfully.`);
                                  // Refresh the runs after deletion
                                  const updatedRuns = await fetchUserRuns(user.uid);
                                  setRuns(updatedRuns);
                                } catch (error) {
                                  console.error("Error deleting run:", error);
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              className="absolute bottom-4 right-4 text-red-500 hover:text-red-700 cursor-pointer"
                              disabled={loading} // Disable button while loading
                            >
                              <TrashIcon className="h-6 w-6" /> {/* Heroicons Trash Icon */}
                            </button>

                            {/* Run Title */}
                            <h3 className="text-2xl font-bold mt-7">{run.title}</h3>

                            {/* Run Goal */}
                            <p className="text-gray-300 italic">{run.description}</p>

                            {/* Weather Details */}
                            {weatherForDay ? (
                              <div className="mt-4">
                                <div className="flex justify-between items-center">
                                  <p className="text-lg">
                                    <strong>Temp:</strong> {weatherForDay.day.avgtemp_c}°C
                                  </p>
                                  <p className="text-lg text-right">
                                    <strong>Condition:</strong> {weatherForDay.day.condition.text}
                                  </p>
                                </div>
                                <p className="text-lg mt-4">
                                  <strong>Winds:</strong> {weatherForDay.day.maxwind_kph} km/h
                                </p>
                              </div>
                            ) : (
                              <p className="text-gray-400">No weather data available</p>
                            )}
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-gray-500 opacity-10 text-6xl font-bold italic">
                      Rest Day
                    </p>
                  )}
                </div>
              </div>
            ))}
          </section>

          <button
            onClick={handleNewRunClick}
            className="bg-amber-600 text-white font-bold p-4 rounded-full text-2xl fixed bottom-15 right-10 shadow-lg cursor-pointer"
          >
            + New Run
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Welcome to Crunicle</h1>
          <button
            onClick={handleSignIn}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Sign In with GitHub
          </button>
        </>
      )}
    </main>
  );
}