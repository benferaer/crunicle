'use client';

async function fetchWeatherData() {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const CITY = "Calgary";

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${CITY}&days=7`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();
    return data; // Return the full weather data
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

export default fetchWeatherData;