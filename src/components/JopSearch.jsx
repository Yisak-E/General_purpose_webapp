import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

// This is where you would normally get your API key from environment variables
const API_KEY = 'c8b4f4187fmsh7b80bfb6f31dee5p195f83jsn34b238ea4898';
const API_HOST = 'jsearch.p.rapidapi.com';
const API_URL = `https://${API_HOST}/search`;

export default function JopSearch() {
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const navigateToHome = () => {
        nav('/');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const query = e.target.query.value;
        const location = e.target.location.value;
        const date_posted = e.target.date_posted.value;
        const country = e.target.country.value;

        // Clear previous results and errors
        setResults([]);
        setError('');

        if (!query && !location) {
            setError('Please enter at least a job title or a location.');
            return;
        }

        setLoading(true);

        try {
            // Correctly separate the query and location parameters
            const params = {
                query: query,
                location: location,
                page: '1',
                num_pages: '1',
                country: country,
                date_posted: date_posted
            };

            const response = await axios.get(API_URL, {
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': API_HOST
                },
                params: params
            });

            if (response.data && response.data.data) {
                setResults(response.data.data);
                if (response.data.data.length === 0) {
                    setError('No jobs found for your search criteria.');
                }
            } else {
                setError('Failed to retrieve job data. Please try again later.');
            }

        } catch (error) {
            console.error('Error fetching job data:', error);
            setError('An error occurred while fetching job data. Please check your network connection or try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <header className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl mb-6 flex justify-between items-center">
                <button
                    onClick={navigateToHome}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                    Home
                </button>
                <h1 className="text-4xl font-extrabold text-blue-700">Job Finder</h1>
            </header>

            <section className="bg-white shadow-lg rounded-xl p-8 w-full max-w-4xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Your Next Job</h2>
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="query" className="block text-gray-700 font-semibold mb-2">Job Title or Keywords:</label>
                            <input
                                type="text"
                                id="query"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Software Engineer"
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">Location:</label>
                            <input
                                type="text"
                                id="location"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., New York, NY"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date_posted" className="block text-gray-700 font-semibold mb-2">Date Posted:</label>
                            <select
                                id="date_posted"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Anytime</option>
                                <option value="last_24_hours">Last 24 hours</option>
                                <option value="last_7_days">Last 7 days</option>
                                <option value="last_14_days">Last 14 days</option>
                                <option value="last_30_days">Last 30 days</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="country" className="block text-gray-700 font-semibold mb-2">Country:</label>
                            <select
                                id="country"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="us">United States</option>
                                <option value="ca">Canada</option>
                                <option value="gb">United Kingdom</option>
                                <option value="au">Australia</option>
                                <option value="ae">United Arab Emirates</option>
                            </select>
                        </div>
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Search Jobs
                        </button>
                    </div>
                </form>

                <div className="mt-8">
                    {loading && (
                        <p className="text-center text-gray-500">Searching for jobs...</p>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
                            {error}
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <div className="space-y-4">
                            {results.map((job) => (
                                <div key={job.job_id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
                                    <h3 className="text-xl font-bold text-blue-800">{job.job_title}</h3>
                                    <p className="text-gray-600 mt-1">{job.employer_name} - {job.job_city}, {job.job_country}</p>
                                    <p className="text-sm text-gray-500 mt-2">Posted: {job.job_posted_at_timestamp ? new Date(job.job_posted_at_timestamp).toLocaleDateString() : 'N/A'}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {job.job_employment_type && (
                                            <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">{job.job_employment_type}</span>
                                        )}
                                        {job.job_min_salary && (
                                            <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">Min Salary: ${job.job_min_salary.toLocaleString()}</span>
                                        )}
                                    </div>
                                    <a
                                        href={job.job_apply_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                                    >
                                        Apply
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
