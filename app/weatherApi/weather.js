'use client';

async function fetchWeatherData() {
    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

    const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=Calgary&days=7`,
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export default fetchWeatherData;