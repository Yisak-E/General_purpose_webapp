'use client';

import { useWeatherContext, WeatherResponse } from "@/context/WeatherContext";
import { useState } from "react";


export default function WeatherClient() {
    const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
    const {location, setLocation, getFromFirestore} = useWeatherContext();
    return (
        <main className="p-4">
            <article className="grid gap-4 lg:grid-cols-2">
                <section className="bg-white p-4 rounded shadow col-span-1">
                    <h1 className="text-2xl font-bold mb-4">Weather Dashboard</h1>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={location}    
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter location"
                            className="border p-2 mr-2"
                        />
                        <button
                            onClick={() => getFromFirestore(location).then(data => setWeatherData(data as WeatherResponse))}
                            className="bg-blue-500 text-white p-2 rounded mr-2"
                        >
                            Get Weather
                        </button>
                    </div>
                </section>

                <section className="bg-white p-4 rounded shadow col-span-1">
                    {/* Weather display component can go here */}
                    <h2 className="text-xl font-bold mb-4">Weather Information</h2>
                    {
                        weatherData && (
                            <div>
                                <p>Temperature: {weatherData.main.temp}</p>
                                <p>Condition: {weatherData.weather[0].description}</p>
                                {/* Add more weather details as needed */}
                            </div>
                        )
                    }
                </section>
            </article>
            
        </main>
    );
}
