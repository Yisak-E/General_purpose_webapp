import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

// API Configuration
const API_KEY = 'c8b4f4187fmsh7b80bfb6f31dee5p195f83jsn34b238ea4898';
const API_HOST = 'jsearch.p.rapidapi.com';
const API_URL = `https://${API_HOST}/search`;

// Skill categories and descriptions
const SKILL_CATEGORIES = {
    programming: {
        name: "Programming & Development",
        skills: [
            "JavaScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go",
            "React", "Angular", "Vue.js", "Node.js", "Express.js", "Django", "Flask", "Spring Boot",
            "SQL", "MongoDB", "PostgreSQL", "Redis", "Firebase", "AWS", "Docker", "Kubernetes",
            "Git", "REST APIs", "GraphQL", "Microservices", "CI/CD", "Testing", "DevOps"
        ]
    },
    design: {
        name: "Design & Creative",
        skills: [
            "UI/UX Design", "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "InDesign",
            "Wireframing", "Prototyping", "User Research", "Design Systems", "Typography",
            "Color Theory", "Motion Design", "3D Modeling", "Video Editing", "Graphic Design"
        ]
    },
    business: {
        name: "Business & Management",
        skills: [
            "Project Management", "Agile", "Scrum", "Kanban", "Strategic Planning", "Budgeting",
            "Financial Analysis", "Market Research", "Business Development", "Sales", "Marketing",
            "Digital Marketing", "SEO", "Content Strategy", "CRM", "Data Analysis", "Leadership"
        ]
    },
    data: {
        name: "Data & Analytics",
        skills: [
            "Data Analysis", "Machine Learning", "Data Science", "Python", "R", "SQL", "Pandas",
            "NumPy", "TensorFlow", "PyTorch", "Tableau", "Power BI", "Excel", "Statistics",
            "Big Data", "Hadoop", "Spark", "Data Visualization", "ETL", "Data Mining"
        ]
    },
    soft: {
        name: "Soft Skills",
        skills: [
            "Communication", "Teamwork", "Problem Solving", "Critical Thinking", "Time Management",
            "Adaptability", "Creativity", "Leadership", "Emotional Intelligence", "Negotiation",
            "Presentation", "Public Speaking", "Collaboration", "Conflict Resolution", "Decision Making"
        ]
    }
};

export default function JobSearch() {
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [showSkillPanel, setShowSkillPanel] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);
    const [showSavedJobs, setShowSavedJobs] = useState(false);
    const nav = useNavigate();

    // Load search history and saved jobs from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem('jobSearchHistory');
        const savedJobsData = localStorage.getItem('savedJobs');

        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory));
        }
        if (savedJobsData) {
            setSavedJobs(JSON.parse(savedJobsData));
        }
    }, []);

    const navigateToHome = () => {
        nav('/home');
    };

    const toggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    const addSkillToQuery = (skill) => {
        const queryInput = document.getElementById('query');
        if (queryInput) {
            const currentValue = queryInput.value;
            queryInput.value = currentValue ? `${currentValue}, ${skill}` : skill;
        }
        setShowSkillPanel(false);
    };

    const saveJob = (job) => {
        const jobToSave = {
            ...job,
            savedAt: new Date().toISOString(),
            id: job.job_id || Date.now().toString() // Ensure unique ID
        };

        const isAlreadySaved = savedJobs.some(savedJob =>
            savedJob.job_id === job.job_id ||
            (savedJob.job_title === job.job_title && savedJob.employer_name === job.employer_name)
        );

        if (isAlreadySaved) {
            // Remove from saved jobs
            const updatedSavedJobs = savedJobs.filter(savedJob =>
                !(savedJob.job_id === job.job_id ||
                  (savedJob.job_title === job.job_title && savedJob.employer_name === job.employer_name))
            );
            setSavedJobs(updatedSavedJobs);
            localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
        } else {
            // Add to saved jobs
            const updatedSavedJobs = [jobToSave, ...savedJobs];
            setSavedJobs(updatedSavedJobs);
            localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
        }
    };

    const isJobSaved = (job) => {
        return savedJobs.some(savedJob =>
            savedJob.job_id === job.job_id ||
            (savedJob.job_title === job.job_title && savedJob.employer_name === job.employer_name)
        );
    };

    const removeSavedJob = (jobId) => {
        const updatedSavedJobs = savedJobs.filter(job =>
            !(job.job_id === jobId || job.id === jobId)
        );
        setSavedJobs(updatedSavedJobs);
        localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
    };

    const clearAllSavedJobs = () => {
        setSavedJobs([]);
        localStorage.removeItem('savedJobs');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const query = formData.get('query') || '';
        const location = formData.get('location') || '';
        const date_posted = formData.get('date_posted') || 'all';
        const country = formData.get('country') || 'us';

        // Clear previous results and errors
        setResults([]);
        setError('');
        setShowSavedJobs(false);

        if (!query && !location) {
            setError('Please enter at least a job title or a location.');
            return;
        }

        setLoading(true);

        try {
            const searchQuery = selectedSkills.length > 0
                ? `${query} ${selectedSkills.join(' ')}`
                : query;

            const params = {
                query: searchQuery,
                location: location,
                page: '1',
                num_pages: '3',
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
                const jobs = response.data.data;
                setResults(jobs);

                // Save to search history
                const searchEntry = {
                    query: searchQuery,
                    location: location,
                    results: jobs.length,
                    timestamp: new Date().toISOString()
                };

                const updatedHistory = [searchEntry, ...searchHistory.slice(0, 9)];
                setSearchHistory(updatedHistory);
                localStorage.setItem('jobSearchHistory', JSON.stringify(updatedHistory));

                if (jobs.length === 0) {
                    setError('No jobs found for your search criteria. Try broadening your search.');
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

    const getSalaryRange = (job) => {
        if (job.job_min_salary && job.job_max_salary) {
            return `$${job.job_min_salary.toLocaleString()} - $${job.job_max_salary.toLocaleString()}`;
        } else if (job.job_min_salary) {
            return `From $${job.job_min_salary.toLocaleString()}`;
        } else if (job.job_max_salary) {
            return `Up to $${job.job_max_salary.toLocaleString()}`;
        }
        return 'Salary not specified';
    };

    const getJobLevel = (title) => {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('senior') || titleLower.includes('sr.') || titleLower.includes('lead')) {
            return 'Senior';
        } else if (titleLower.includes('mid') || titleLower.includes('intermediate')) {
            return 'Mid-Level';
        } else if (titleLower.includes('junior') || titleLower.includes('entry') || titleLower.includes('graduate')) {
            return 'Entry Level';
        } else if (titleLower.includes('principal') || titleLower.includes('architect') || titleLower.includes('manager')) {
            return 'Principal/Manager';
        }
        return 'Not specified';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={navigateToHome}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Home</span>
                        </button>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Career Finder Pro
                        </h1>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowSavedJobs(!showSavedJobs)}
                                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                <span>💼</span>
                                <span>Saved Jobs ({savedJobs.length})</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Saved Jobs Panel */}
                {showSavedJobs && (
                    <div className="mb-8 bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                💼 Saved Jobs ({savedJobs.length})
                            </h2>
                            {savedJobs.length > 0 && (
                                <button
                                    onClick={clearAllSavedJobs}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        {savedJobs.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">📭</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved jobs yet</h3>
                                <p className="text-gray-500">Search for jobs and save them to view them here later.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {savedJobs.map((job) => (
                                    <div key={job.id || job.job_id} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-800">{job.job_title}</h3>
                                                <p className="text-gray-600 mt-1">{job.employer_name} • {job.job_city}, {job.job_country}</p>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Saved on {formatDate(job.savedAt)}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <a
                                                    href={job.job_apply_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                                                >
                                                    Apply
                                                </a>
                                                <button
                                                    onClick={() => removeSavedJob(job.job_id || job.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

                    {/* Left Sidebar - Search & Filters */}
                    <div className="xl:col-span-1 space-y-6">
                        {/* Search Form */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Dream Job</h2>
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div>
                                    <label htmlFor="query" className="block text-gray-700 font-semibold mb-2">
                                        Job Title or Keywords
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="query"
                                            name="query"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., Senior React Developer"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSkillPanel(!showSkillPanel)}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-blue-500 transition-colors"
                                        >
                                            💡
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., San Francisco, CA"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="date_posted" className="block text-gray-700 font-semibold mb-2">
                                            Date Posted
                                        </label>
                                        <select
                                            id="date_posted"
                                            name="date_posted"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="all">Anytime</option>
                                            <option value="today">Today</option>
                                            <option value="last_24_hours">Last 24 hours</option>
                                            <option value="last_7_days">Last 7 days</option>
                                            <option value="last_14_days">Last 14 days</option>
                                            <option value="last_30_days">Last 30 days</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-gray-700 font-semibold mb-2">
                                            Country
                                        </label>
                                        <select
                                            id="country"
                                            name="country"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="us">United States</option>
                                            <option value="ca">Canada</option>
                                            <option value="gb">United Kingdom</option>
                                            <option value="au">Australia</option>
                                            <option value="ae">UAE</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Selected Skills */}
                                {selectedSkills.length > 0 && (
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            Selected Skills ({selectedSkills.length})
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSkills.map(skill => (
                                                <span
                                                    key={skill}
                                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                                                >
                                                    <span>{skill}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSkill(skill)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Searching...</span>
                                        </div>
                                    ) : (
                                        '🔍 Search Jobs'
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Skill Suggestions Panel */}
                        {showSkillPanel && (
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Skill Suggestions</h3>
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {Object.entries(SKILL_CATEGORIES).map(([key, category]) => (
                                        <div key={key}>
                                            <h4 className="font-semibold text-gray-700 mb-2">{category.name}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {category.skills.map(skill => (
                                                    <button
                                                        key={skill}
                                                        type="button"
                                                        onClick={() => addSkillToQuery(skill)}
                                                        className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full text-sm transition-all duration-200"
                                                    >
                                                        {skill}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search History */}
                        {searchHistory.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Searches</h3>
                                <div className="space-y-3">
                                    {searchHistory.slice(0, 5).map((search, index) => (
                                        <div key={index} className="text-sm text-gray-600 border-l-4 border-blue-500 pl-3">
                                            <div className="font-medium">{search.query}</div>
                                            <div>{search.location} • {search.results} results</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Content - Job Results */}
                    <div className="xl:col-span-3">
                        {/* Stats Bar */}
                        {results.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                                <div className="flex flex-wrap items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {results.length} Jobs Found
                                        </h3>
                                        <p className="text-gray-600">Matching your search criteria</p>
                                    </div>
                                    <div className="flex space-x-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {results.filter(job => job.job_employment_type === 'FULLTIME').length}
                                            </div>
                                            <div className="text-sm text-gray-600">Full-time</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {results.filter(job => job.job_min_salary).length}
                                            </div>
                                            <div className="text-sm text-gray-600">With Salary</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {results.filter(job => isJobSaved(job)).length}
                                            </div>
                                            <div className="text-sm text-gray-600">Saved</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="text-red-500 text-xl">⚠️</div>
                                    <div>
                                        <h3 className="font-semibold text-red-800">Search Error</h3>
                                        <p className="text-red-600">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Job Results */}
                        <div className="space-y-6">
                            {results.map((job) => (
                                <div key={job.job_id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                                                        {job.job_title}
                                                    </h3>
                                                    <p className="text-lg text-gray-700 mt-1">
                                                        {job.employer_name} • {job.job_city}, {job.job_country}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                        {getJobLevel(job.job_title)}
                                                    </div>
                                                    {isJobSaved(job) && (
                                                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                            ✅ Saved
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-3">
                                                {job.job_employment_type && (
                                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        {job.job_employment_type}
                                                    </span>
                                                )}
                                                {job.job_min_salary && (
                                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        💰 {getSalaryRange(job)}
                                                    </span>
                                                )}
                                                {job.job_is_remote && (
                                                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        🏠 Remote
                                                    </span>
                                                )}
                                            </div>

                                            {job.job_description && (
                                                <div className="mt-4">
                                                    <p className="text-gray-600 line-clamp-3">
                                                        {job.job_description.substring(0, 200)}...
                                                    </p>
                                                </div>
                                            )}

                                            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                                                <span>📅 Posted {job.job_posted_at_timestamp ? new Date(job.job_posted_at_timestamp).toLocaleDateString() : 'Recently'}</span>
                                                {job.job_offer_expiration_timestamp && (
                                                    <span>⏰ Expires {new Date(job.job_offer_expiration_timestamp).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-3">
                                            <a
                                                href={job.job_apply_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-center shadow-lg"
                                            >
                                                Apply Now
                                            </a>
                                            <button
                                                onClick={() => saveJob(job)}
                                                className={`font-semibold py-3 px-6 rounded-xl transition-all duration-300 border ${
                                                    isJobSaved(job)
                                                        ? 'bg-green-500 hover:bg-green-600 text-white border-green-500'
                                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                {isJobSaved(job) ? '✅ Saved' : '💾 Save Job'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {!loading && results.length === 0 && !error && !showSavedJobs && (
                            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Start Your Job Search</h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    Enter a job title, location, or browse skill suggestions to find your next career opportunity.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}