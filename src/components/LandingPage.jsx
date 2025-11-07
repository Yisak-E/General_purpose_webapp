import { useNavigate } from "react-router-dom";

import '../general.css';

// Import your images
import scheduleImg from '../assets/schedule.jpg';
import studyplanImg from '../assets/studyplan.jpg';
import jopSearchImg from '../assets/jopSearch.jpg';
import weatherImg from '../assets/weatherabu.png';
import nutTrackerImg from '../assets/nut_tracker.jpg';
import moodyImg from '../assets/img.png';

export default function LandingPage() {
    const navigate = useNavigate();

    const features = [
        {
            title: 'Smart Scheduler',
            image: scheduleImg,
            description: 'Organize your weekly activities with our intuitive scheduling system. Plan your days, set reminders, and never miss important appointments or deadlines again.',
            icon: '📅',
            category: 'Productivity'
        },
        {
            title: 'Study Plan Creator',
            image: studyplanImg,
            description: 'Design personalized study schedules that adapt to your learning style. Track progress, set goals, and optimize your study sessions for maximum efficiency.',
            icon: '📚',
            category: 'Education'
        },
        {
            title: 'Job Search Assistant',
            image: jopSearchImg,
            description: 'Streamline your job hunting process with smart filters, application tracking, and personalized recommendations tailored to your career goals.',
            icon: '💼',
            category: 'Career'
        },
        {
            title: 'Live Weather Updates',
            image: weatherImg,
            description: 'Get real-time weather forecasts for any location worldwide. Plan your day with accurate temperature, precipitation, and atmospheric conditions.',
            icon: '🌤️',
            category: 'Utility'
        },
        {
            title: 'Memory Challenge',
            image: 'https://img.freepik.com/free-vector/memory-game-concept-illustration_114360-1921.jpg?w=740&t=st=1696117203~exp=1696117803~hmac=5a3e2f0f4e2e4fc1a4e3f8e6f4b5e6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k',
            description: 'Boost your cognitive skills with engaging memory games. Multiple difficulty levels to challenge and improve your concentration and recall abilities.',
            icon: '🧠',
            category: 'Games'
        },
        {
            title: "Nutrition Tracker",
            image: nutTrackerImg,
            description: "Monitor your daily nutritional intake, set health goals, and maintain a balanced lifestyle with our comprehensive food tracking system.",
            icon: '🥗',
            category: 'Health'
        },
        {
            title: 'Smart Todo Manager',
            image: 'https://img.freepik.com/free-vector/todo-list-concept-illustration_114360-7860.jpg?w=740&t=st=1696117263~exp=1696117863~hmac=3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8',
            description: 'Organize tasks efficiently with priority settings, deadlines, and progress tracking. Stay productive and accomplish your daily objectives.',
            icon: '✅',
            category: 'Productivity'
        },
        {
            title: 'Mood Tracker',
            image: moodyImg,
            description: 'Document your emotional journey with daily mood entries. Identify patterns and gain insights into your mental well-being over time.',
            icon: '😊',
            category: 'Wellness'
        },
        {
            title: 'Digital Notebook',
            image: 'https://img.freepik.com/free-vector/coming-soon-concept-illustration_114360-7861.jpg?w=740&t=st=1696117323~exp=1696117923~hmac=5c6d7e8f9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5',
            description: 'Capture ideas, notes, and inspiration in one organized space. Coming soon with advanced formatting and collaboration features.',
            icon: '📓',
            category: 'Productivity'
        },
        {
            title: 'Language Progress Tracker',
            image: 'https://tse4.mm.bing.net/th/id/OIP.PMRRjYlgOPwDQ1W-Z0l2_gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
            description: 'Monitor your Spanish language learning journey with progress tracking, vocabulary builders, and skill assessment tools.',
            icon: '🇪🇸',
            category: 'Education'
        }, {
            title: 'Exam Planner Pro',
            image: 'https://img.freepik.com/free-vector/exam-preparation-concept-illustration_114360-12347.jpg?w=740&t=st=1696117500~exp=1696118100~hmac=ghi789',
            description: 'Plan your exam preparation with subject tracking, progress analytics, coverage monitoring, and exam probability assessment.',
            icon: '📚',
            category: 'Education'
        }

    ];

    const categories = [...new Set(features.map(feature => feature.category))];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Use Header with landing page props */}
            {/*<Header headerProps={{*/}
            {/*    title: 'GPA Productivity Suite',*/}
            {/*    navLinks: [] // Empty array since we'll show Get Started button in Header*/}
            {/*}} />*/}
            {/* Hero Section */}
            <section className="text-center py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                        Your All-in-One <span className="text-yellow-300">Productivity</span> Suite
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                        Discover a comprehensive collection of tools designed to enhance your daily life,
                        boost productivity, and support your personal growth journey.
                    </p>
                    <button
                        onClick={() => navigate('/home')}
                        className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        🚀 Get Glimpse - Explore All Features
                    </button>
                </div>
            </section>

            {/* Features Overview */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Everything You Need in One Place
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From productivity tools to wellness trackers, our suite offers comprehensive
                            solutions for modern life challenges.
                        </p>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        <button className="px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all border border-gray-200 font-semibold text-gray-700 hover:bg-blue-50">
                            All Features
                        </button>
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                className="px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all border border-gray-200 font-semibold text-gray-700 hover:bg-blue-50"
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                                        <span className="text-2xl">{feature.icon}</span>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {feature.category}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {feature.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            Click to explore →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                            <div className="text-gray-600">Powerful Tools</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-600 mb-2">4</div>
                            <div className="text-gray-600">Categories</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                            <div className="text-gray-600">Free Access</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                            <div className="text-gray-600">Available</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-500 to-blue-600 text-white">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Transform Your Daily Routine?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Join thousands of users who have already enhanced their productivity and well-being with our tools.
                    </p>
                    <button
                        onClick={() => navigate('/home')}
                        className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                    >
                        🎯 Start Exploring Now
                    </button>
                    <p className="mt-4 text-blue-200">
                        No registration required • Instant access • Completely free
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-gray-400">
                        © 2024 GPA Productivity Suite. All rights reserved.
                        Designed to make your life better, one feature at a time.
                    </p>
                </div>
            </footer>
        </div>
    );
}