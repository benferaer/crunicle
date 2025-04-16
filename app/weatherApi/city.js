'use client';

import { useState, useEffect } from 'react';

async function fetchCityCoordinates(cityName) {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`);
    if (!response.ok) {
        throw new Error('Failed to fetch city coordinates');
    }
    const data = await response.json();

    if (data.length === 0) {
        throw new Error('City not found');
    }

    return { lat: data[0].lat, lon: data[0].lon };
}

// Example usage
export default function useCityCoordinates(cityName) {
    const [coordinates, setCoordinates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!cityName) return;

        const fetchData = async () => {
            try {
                const coords = await fetchCityCoordinates(cityName);
                setCoordinates(coords);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [cityName]);

    return { coordinates, loading, error };
}