import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = ({ city = "Abu Dhabi" }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('celsius'); // 'celsius' or 'fahrenheit'
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const [currentResponse, forecastResponse] = await Promise.all([
          axios.get(
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
          ),
          axios.get(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no&alerts=no`
          )
        ]);

        setWeather(currentResponse.data);
        setForecast(forecastResponse.data);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setError("Failed to fetch weather data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city, API_KEY]);

  const toggleUnit = () => {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const getTemperature = (tempC, tempF) => {
    return unit === 'celsius' ? tempC : tempF;
  };

  const getWindSpeed = (kph) => {
    return unit === 'celsius' ? `${kph} kph` : `${(kph * 0.621371).toFixed(1)} mph`;
  };

  const getVisibility = (km) => {
    return unit === 'celsius' ? `${km} km` : `${(km * 0.621371).toFixed(1)} miles`;
  };

  const getPressure = (mb) => {
    return unit === 'celsius' ? `${mb} mb` : `${(mb * 0.02953).toFixed(2)} inHg`;
  };

  const getUVIndexLevel = (uv) => {
    if (uv <= 2) return { level: 'Low', color: 'text-green-500' };
    if (uv <= 5) return { level: 'Moderate', color: 'text-yellow-500' };
    if (uv <= 7) return { level: 'High', color: 'text-orange-500' };
    if (uv <= 10) return { level: 'Very High', color: 'text-red-500' };
    return { level: 'Extreme', color: 'text-purple-500' };
  };

  const getFeelsLike = (tempC, humidity, windKph) => {
    // Simple heat index calculation
    if (tempC >= 27) {
      const heatIndex = tempC + 0.33 * (humidity - 20) - 0.7 * (windKph / 10);
      return Math.round(heatIndex);
    }
    // Wind chill for colder temperatures
    if (tempC <= 10) {
      const windChill = 13.12 + 0.6215 * tempC - 11.37 * Math.pow(windKph, 0.16) + 0.3965 * tempC * Math.pow(windKph, 0.16);
      return Math.round(windChill);
    }
    return tempC;
  };

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-lg">Loading weather data...</span>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  );

  if (!weather) return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
      Weather data not available for {city}.
    </div>
  );

  const { location, current } = weather;
  const uvInfo = getUVIndexLevel(current.uv);
  const feelsLike = getFeelsLike(current.temp_c, current.humidity, current.wind_kph);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl shadow-lg overflow-hidden md:mt-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{location.name}, {location.country}</h2>
            <p className="text-blue-100">{new Date(current.last_updated).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          <button
            onClick={toggleUnit}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            °{unit === 'celsius' ? 'F' : 'C'}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Current Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Weather Card */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center lg:col-span-1">
            <div className="flex items-center justify-center mb-4">
              <img
                src={current.condition.icon}
                alt={current.condition.text}
                className="w-20 h-20"
              />
            </div>
            <div className="text-5xl font-bold text-gray-800 mb-2">
              {getTemperature(current.temp_c, current.temp_f)}°
              <span className="text-2xl text-gray-500">{unit === 'celsius' ? 'C' : 'F'}</span>
            </div>
            <p className="text-xl text-gray-600 mb-4">{current.condition.text}</p>
            <div className="text-sm text-gray-500">
              Feels like {getTemperature(feelsLike, (feelsLike * 9/5 + 32).toFixed(1))}°
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weather Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{current.humidity}%</div>
                <div className="text-sm text-gray-600">Humidity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{getWindSpeed(current.wind_kph)}</div>
                <div className="text-sm text-gray-600">Wind Speed</div>
                <div className="text-xs text-gray-500">Direction: {current.wind_dir}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{getPressure(current.pressure_mb)}</div>
                <div className="text-sm text-gray-600">Pressure</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">{getVisibility(current.vis_km)}</div>
                <div className="text-sm text-gray-600">Visibility</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{current.cloud}%</div>
                <div className="text-sm text-gray-600">Cloud Cover</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${uvInfo.color}`}>{current.uv}</div>
                <div className="text-sm text-gray-600">UV Index</div>
                <div className={`text-xs ${uvInfo.color}`}>{uvInfo.level}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Sunrise & Sunset */}
          {forecast?.forecast?.forecastday[0]?.astro && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sun & Moon</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl text-yellow-500 mb-1">🌅</div>
                  <div className="font-semibold text-gray-800">{forecast.forecast.forecastday[0].astro.sunrise}</div>
                  <div className="text-sm text-gray-600">Sunrise</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-orange-500 mb-1">🌇</div>
                  <div className="font-semibold text-gray-800">{forecast.forecast.forecastday[0].astro.sunset}</div>
                  <div className="text-sm text-gray-600">Sunset</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-gray-400 mb-1">🌙</div>
                  <div className="font-semibold text-gray-800">{forecast.forecast.forecastday[0].astro.moonrise}</div>
                  <div className="text-sm text-gray-600">Moonrise</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-gray-600 mb-1">🌑</div>
                  <div className="font-semibold text-gray-800">{forecast.forecast.forecastday[0].astro.moonset}</div>
                  <div className="text-sm text-gray-600">Moonset</div>
                </div>
              </div>
            </div>
          )}

          {/* Air Quality */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Atmospheric Conditions</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Dew Point</span>
                <span className="font-semibold">{getTemperature(current.dewpoint_c, current.dewpoint_f)}°</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Heat Index</span>
                <span className="font-semibold">{getTemperature(feelsLike, (feelsLike * 9/5 + 32).toFixed(1))}°</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Wind Gusts</span>
                <span className="font-semibold">{getWindSpeed(current.gust_kph)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Precipitation</span>
                <span className="font-semibold">{current.precip_mm} mm</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Day Forecast */}
        {forecast?.forecast?.forecastday && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">3-Day Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {forecast.forecast.forecastday.map((day, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-800 mb-2">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <img
                    src={day.day.condition.icon}
                    alt={day.day.condition.text}
                    className="w-12 h-12 mx-auto mb-2"
                  />
                  <div className="text-lg font-bold text-gray-800">
                    {getTemperature(day.day.maxtemp_c, day.day.maxtemp_f)}°
                  </div>
                  <div className="text-sm text-gray-600">
                    {getTemperature(day.day.mintemp_c, day.day.mintemp_f)}°
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{day.day.condition.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;