'use client';

import { useWeatherContext, WeatherResponse } from "@/context/WeatherContext";
import { useEffect, useState } from "react";
import iconlists from '@/public/weather/iconlist.json';
import Image from "next/image";


export default function WeatherClient() {
    const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
    const [icons, setIcons] = useState<{[key: string]: {description: string; image_url: string}}>(iconlists);
    const {location, setLocation, getFromFirestore} = useWeatherContext();

    useEffect(() => {
        handleWeatherFetch();
       
    }, []);

    const handleWeatherFetch = async () => {
        try {
            getFromFirestore(location).then(data => setWeatherData(data as WeatherResponse));
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }

    }
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
                            onClick={handleWeatherFetch}
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
                            <div className="space-y-4 flex flex-wrap gap-7">
                               <section className="flex flex-col justify-center items-center boarder p-4 rounded shadow hover:shadow-lg transition-shadow">
                                    <h3 className="text-lg font-semibold">{weatherData.name}, {weatherData.sys.country}</h3>
                                    <p className="text-5xl font-bold">
                                    {Math.round(weatherData.main.temp)}°C
                                    </p>
                                    <p className="text-lg capitalize">
                                    {weatherData.weather[0].description}
                                    </p>
                                    <div className="mt-4">
                                    <Image 
                                        src={icons[weatherData.weather[0].icon]?.image_url || '/weather/default.png'}
                                        alt={icons[weatherData.weather[0].icon]?.description || 'Weather Icon'}
                                        width={100}
                                        height={100}
                                    />
                                    </div>
                               </section >

                               <section className=" flex flex-col justify-center  items-center boarder p-4 rounded shadow hover:shadow-lg transition-shadow">
                                    <h4 className="text-md font-semibold mt-4">Details:</h4>
                                    <ul className="list-disc list-inside">
                                        <li>Humidity: {weatherData.main.humidity}%</li>
                                        <li>Pressure: {weatherData.main.pressure} hPa</li>
                                        <li>Wind Speed: {weatherData.wind.speed} m/s</li>
                                        <li>Feels Like: {Math.round(weatherData.main.feels_like)}°C</li>
                                    </ul>

                               </section>


                            </div>
                        )
                    }
                </section>
            </article>
            
        </main>
    );
}



