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
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-menu") && menuOpen) {
        setMenuOpen(false); // Close the menu if the click is outside
      }
    };
  
    document.addEventListener("click", handleClickOutside);
  
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  const handleDelete = async (runId) => {
    if (!window.confirm("Are you sure you want to delete this run?")) {
      return; // Exit if the user cancels the confirmation
    }

    setLoading(true); // Start loading
    try {
      await deleteRun(runId); // Call the deleteRun function
      console.log(`Run with ID ${runId} deleted successfully.`);
      // Refresh the runs after deletion
      const updatedRuns = await fetchUserRuns(user.uid);
      setRuns(updatedRuns);
    } catch (error) {
      console.error("Error deleting run:", error);
    } finally {
      setLoading(false); // Stop loading
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

        {/* Navigation Links */}
        <nav className="flex gap-4">
          <button
            className="text-white hover:text-amber-400 font-semibold transition duration-200"
            onClick={() => router.push("/about")} // Navigate to the About page
          >
            About
          </button>
        </nav>

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
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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

      {/* Main Content */}
      <main className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6">
        {user ? (
          <>
            {/* Banner */}
            <div className="text-center py-6">
              <p className="text-xl md:text-2xl font-semibold italic text-amber-400">
                Plan it. Run it. Track it.
              </p>
            </div>

            {/* Week Navigation */}
            <div className="flex gap-4 items-center mb-7 mt-10">
              <button
                onClick={handlePreviousWeek}
                className="text-white p-3 rounded-full font-bold hover:bg-gray-500 hover:scale-110 transition-transform duration-200 cursor-pointer"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <h2 className="text-4xl mb-2 font-bold">{thisWeek[0].month}</h2>
              <button
                onClick={handleNextWeek}
                className="text-white p-3 rounded-full font-bold hover:bg-gray-500 hover:scale-110 transition-transform duration-200 cursor-pointer"
              >
                <ChevronRightIcon className="h-6 w-6" />
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
                  <div className="flex-grow ml-10 flex flex-wrap justify-center my-auto gap-15">
                    {runs.filter((run) => run.date === day.date).length > 0 ? (
                      runs
                        .filter((run) => run.date === day.date)
                        .map((run) => {
                          const weatherForDay = weatherData?.find(
                            (weather) =>
                              format(new Date(weather.date), "yyyy-MM-dd") ===
                              format(new Date(run.date), "yyyy-MM-dd")
                          );

                          return (
                            <div
                              key={run.id}
                              className="relative bg-gray-700 text-white p-6 rounded-3xl shadow-lg w-[500px] flex flex-col gap-4 cursor-pointer hover:shadow-xl transition-shadow"
                              onClick={() => router.push(`/Edit-Run/${run.id}`)}
                            >
                              {/* Badge */}
                              {weatherForDay && (
                                <div
                                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${
                                    weatherForDay.day.avgtemp_c > 10 &&
                                    weatherForDay.day.avgtemp_c < 20
                                      ? "bg-green-500 text-white"
                                      : weatherForDay.day.avgtemp_c >= 20 &&
                                        weatherForDay.day.avgtemp_c < 27
                                      ? "bg-orange-500 text-white"
                                      : weatherForDay.day.avgtemp_c >= 0 &&
                                        weatherForDay.day.avgtemp_c <= 10
                                      ? "bg-blue-300 text-black"
                                      : "bg-gray-500 text-white"
                                  }`}
                                >
                                  {weatherForDay.day.avgtemp_c > 10 &&
                                  weatherForDay.day.avgtemp_c < 20
                                    ? "Good Day for a Run"
                                    : weatherForDay.day.avgtemp_c >= 20 &&
                                      weatherForDay.day.avgtemp_c < 27
                                    ? "May Be a Bit Hot"
                                    : weatherForDay.day.avgtemp_c >= 0 &&
                                      weatherForDay.day.avgtemp_c <= 10
                                    ? "May Be Chilly"
                                    : "No Data"}
                                </div>
                              )}

                              {/* Trash Icon */}
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation(); // Prevent triggering the card click event
                                  await handleDelete(run.id);
                                }}
                                className="absolute bottom-4 right-4 text-red-500 hover:text-red-700 cursor-pointer"
                                disabled={loading}
                              >
                                <TrashIcon className="h-6 w-6" />
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
          {/* Sign-In Page */}
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
            {/* Welcome Message */}
            <h1 className="text-4xl font-bold mb-6 text-amber-400">
              Welcome to <span className="italic">cRUNicle</span>
            </h1>
            <p className="text-lg text-gray-300 mb-10 text-center max-w-md">
              Your personalized running journal to help you stay motivated, organized, and consistent in building a running habit.
            </p>

            {/* Sign-In Button */}
            <button
              onClick={handleSignIn}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
            >
              Sign In with GitHub
            </button>
          </div>
          </>
        )}
      </main>
    </>
  );
}