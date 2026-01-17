'use client';
import { createContext, useContext, useState } from "react";
import { db } from "@/api/firebaseConfigs";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    doc,
    setDoc,
    getDoc,
    QueryDocumentSnapshot,
    DocumentData,
} from "firebase/firestore";
import { FirebaseError } from 'firebase/app';


/** * Weather Context Type Definition
 * @property {string} location - Current location for weather data
 * @property {function} setLocation - Function to update the location
 * @property {function} getFromFirestore - Function to fetch weather data from Firestore
 * @property {function} saveWeatherDataToFirestore - Function to save weather data to Firestore
 * @throws FirebaseError when Firestore operations fail
 */
type WeatherContextType = {
    location: string;
    setLocation: React.Dispatch<React.SetStateAction<string>>;

    getFromFirestore: (location: string) => Promise<WeatherResponse | void>;
    saveWeatherDataToFirestore: (data: WeatherResponse) => Promise<void>;
}

export const WeatherContext = createContext<WeatherContextType | null>(null);


export const WeatherContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [location , setLocation] = useState<string>('New York');

    const getWeatherData = async (location: string) => {
        const apiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY;
        const response = await fetch(`${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_URL}?q=${location}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        return data;
    };

    const saveWeatherDataToFirestore = async (data: WeatherResponse) => {
        try {
            const docRef = doc(db, 'weatherData', data.name);
            await setDoc(docRef, data);
        } catch (error) {
           throw new FirebaseError('failed-precondition', 'Failed to save weather data');
        }
    };

    const getFromFirestore = async (location: string) => {
        try {
            const docRef = doc(db, 'weatherData', location);
            const docSnap = await getDoc(docRef);
            console.log('Fetched from Firestore:', docSnap.exists());
            if (docSnap.exists()) {
                return docSnap.data() as WeatherResponse;
            }
            else {
                const weatherData = await getWeatherData(location);
                await saveWeatherDataToFirestore(weatherData);
                return weatherData;
            }
        } catch (error) {
            throw new FirebaseError('failed-precondition', 'Failed to fetch weather data');
        }

    }
    

    return (
        <WeatherContext.Provider 
        value={{ location, setLocation, getFromFirestore, saveWeatherDataToFirestore }}>
            {children}
        </WeatherContext.Provider>
    )
    
}

/**
 * Custom hook to use the WeatherContext
 * @throws Error if used outside of WeatherContextProvider
 */
export const  useWeatherContext = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error('useWeatherContext must be used within a WeatherContextProvider');
    }
    return context;
};



/**
 * Weather API Response Type
 * Adapted from OpenWeatherMap API response structure
 * See: https://openweathermap.org/current/data/2.5#JSON/current_JSON
 */
export interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };

  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;

  base: string;

  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };

  visibility: number;

  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };

  rain?: {
    "1h"?: number;
    "3h"?: number;
  };

  snow?: {
    "1h"?: number;
    "3h"?: number;
  };

  clouds: {
    all: number;
  };

  dt: number;

  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };

  timezone: number;
  id: number;
  name: string;
  cod: number;
}