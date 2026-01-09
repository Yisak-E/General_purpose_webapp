import Header from "../headers/Header.jsx";
import Weather from "./Weather.jsx"
import {useState, useEffect} from "react";
import { countriesWithCapitals } from './countriesData'; // Import the list

export default function WeatherAbuDhabi() {
    const [city, setCity] = useState("Dubai");
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Initialize cities from the static list
    useEffect(() => {
        const capitalCities = countriesWithCapitals.map(item => item.capital);
        setCities(capitalCities);

        // Also save to localStorage for persistence
        localStorage.setItem('capitalCities', JSON.stringify(capitalCities));
    }, []);

    // Handle city change with proper filtering
    const handleCityChange = (event) => {
        const cityName = event.target.value;
        setCity(cityName);

        if (cityName.length > 0) {
            const filtered = cities.filter(cityItem =>
                cityItem.toLowerCase().includes(cityName.toLowerCase())
            );
            setFilteredCities(filtered);
            setShowSuggestions(true);
        } else {
            setFilteredCities([]);
            setShowSuggestions(false);
        }
    }

    // Handle city selection from suggestions
    const handleCitySelect = (selectedCity) => {
        setCity(selectedCity);
        setFilteredCities([]);
        setShowSuggestions(false);
    }

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.city-search-container')) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="weather-widget container px-4 py-0 min-w-full min-h-screen">
            <Header headerProps={
                {
                    title: 'Weather App - Worldwide',
                    navLinks: [
                        {label: 'Home', path: '/'},
                        {label: 'Schedules', path: '/schedule'},
                        {label: 'Study Plan', path: '/studyPlan'},
                        {label: 'Job Search', path: '/jobSearch'}
                    ]
                }
            }/>

            <div className="bg-gray-100 p-4 relative min-h-screen md:mt-12">
                <div className="city-search-container max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">World Weather</h2>

                        <div className="relative">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                Search Capital Cities
                            </label>
                            <input
                                type="text"
                                name="city"
                                id="city"
                                value={city}
                                className="bg-white text-black h-12 w-full px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={handleCityChange}
                                placeholder="Enter capital city name..."
                            />

                            {/* Suggestions dropdown */}
                            {showSuggestions && filteredCities.length > 0 && (
                                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                                    {filteredCities.map((cityItem, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                            onClick={() => handleCitySelect(cityItem)}
                                        >
                                            <div className="font-medium text-gray-800">{cityItem}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* No results message */}
                            {showSuggestions && city.length > 0 && filteredCities.length === 0 && (
                                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 p-4">
                                    <p className="text-gray-500 text-center">No capital cities found matching "{city}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <Weather city={city} />

                    {/* Quick capital cities selection */}
                    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Popular Capital Cities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {cities.slice(0, 20).map((cityItem, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-200 text-center"
                                    onClick={() => handleCitySelect(cityItem)}
                                >
                                    <span className="text-sm font-medium">{cityItem}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}