'use client';

import React, { useEffect, useState } from 'react';
import useCityCoordinates from '../weatherApi/city';
import fetchWeatherData from '../weatherApi/weather';

export default function TestCityCoordinates() {
    const { coordinates, loading, error } = useCityCoordinates('Calgary');
    const [weatherData, setWeatherData] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState(null);

    useEffect(() => {
        if (!coordinates) return;

        const fetchData = async () => {
            try {
                const data = await fetchWeatherData();
                console.log('Weather Data:', data); // Log the JSON response to the console
                setWeatherData(data);
            } catch (err) {
                setWeatherError(err.message);
            } finally {
                setWeatherLoading(false);
            }
        };

        fetchData();
    }, [coordinates]);

    if (loading || weatherLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (weatherError) return <p>Error: {weatherError}</p>;

    return (
        <div>
            <h1>City Coordinates</h1>
            <p>Latitude: {coordinates.lat}</p>
            <p>Longitude: {coordinates.lon}</p>

            <h2>Weather Data</h2>
            <pre>{JSON.stringify(weatherData, null, 2)}</pre>
        </div>
    );
}