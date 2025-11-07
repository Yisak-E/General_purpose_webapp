import scheduleImg from '../assets/schedule.jpg';
import studyplanImg from '../assets/studyplan.jpg';
import jopSearchImg from '../assets/jopSearch.jpg';
import weatherImg from '../assets/weatherabu.png';
import nutTrackerImg from '../assets/nut_tracker.jpg';
import tic from '../assets/tic.png';
import moodyImg from '../assets/img.png';
import '../general.css'
import Header from "./headers/Header.jsx";
import {useNavigate} from "react-router-dom";
import { useState } from 'react';

const CardView = ({ card, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`
                group relative
                bg-gradient-to-br from-white to-gray-50
                rounded-2xl shadow-lg
                cursor-pointer
                overflow-hidden
                transition-all duration-500
                transform hover:-translate-y-2
                border border-gray-100
                hover:shadow-2xl
                ${isHovered ? 'scale-105' : 'scale-100'}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => card.navigator(card.navigateTo)}
        >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating Icon Effect */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-10 transform group-hover:scale-150 transition-all duration-700"></div>
            
            {/* Content Container */}
            <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 flex-1">
                        {card.title}
                    </h3>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm transform group-hover:rotate-12 transition-transform duration-300">
                        {index + 1}
                    </div>
                </div>

                {/* Image Container */}
                <div className="relative mb-4 overflow-hidden rounded-xl">
                    <img 
                        src={card.image} 
                        alt={card.title}
                        className="w-full h-40 object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Description */}
                <div className="flex-1">
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 line-clamp-3">
                        {card.description}
                    </p>
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-4 border-t border-gray-100 group-hover:border-blue-200 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                            Click to explore
                        </span>
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center transform group-hover:translate-x-1 transition-transform duration-300">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-1000 blur-xl"></div>
        </div>
    );
}

// Category-based organization
const categories = {
    productivity: {
        title: "🚀 Productivity",
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-50"
    },
    education: {
        title: "📚 Education",
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-50"
    },
    health: {
        title: "💪 Health & Wellness",
        color: "from-orange-500 to-red-500",
        bgColor: "bg-orange-50"
    },
    utilities: {
        title: "🔧 Utilities",
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-50"
    },
    games: {
        title: "🎮 Games & Fun",
        color: "from-yellow-500 to-amber-500",
        bgColor: "bg-yellow-50"
    }
};

export default function HomePage() {
    const nav = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all');

    const navigateTo = (navData) => {
        nav(navData);
    }

    const cards = [
        {
            title: 'Smart Scheduler',
            image: scheduleImg,
            description: 'Organize your weekly activities with our intuitive scheduling system. Plan your days, set reminders, and never miss important deadlines.',
            navigateTo: '/schedule',
            navigator: navigateTo,
            category: 'productivity',
            icon: '📅'
        },
        {
            title: 'Study Plan Creator',
            image: studyplanImg,
            description: 'Design personalized study schedules that adapt to your learning style. Track progress and optimize your study sessions.',
            navigateTo: '/studyPlan',
            navigator: navigateTo,
            category: 'education',
            icon: '📚'
        },
        {
            title: 'Job Search Pro',
            image: jopSearchImg,
            description: 'Streamline your job hunting with smart filters and application tracking. Find your dream career with personalized recommendations.',
            navigateTo: '/jobSearch',
            navigator: navigateTo,
            category: 'productivity',
            icon: '💼'
        },
        {
            title: 'Live Weather Dashboard',
            image: weatherImg,
            description: 'Get real-time weather forecasts with advanced metrics. Plan your day with accurate atmospheric conditions and predictions.',
            navigateTo: '/weather',
            navigator: navigateTo,
            category: 'utilities',
            icon: '🌤️'
        },
        {
            title: 'Memory Challenge Pro',
            image: 'https://img.freepik.com/free-vector/memory-game-concept-illustration_114360-1921.jpg?w=740&t=st=1696117203~exp=1696117803~hmac=5a3e2f0f4e2e4fc1a4e3f8e6f4b5e6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k',
            description: 'Boost cognitive skills with engaging memory games. Multiple difficulty levels to challenge and improve concentration.',
            navigateTo: '/memorygame',
            navigator: navigateTo,
            category: 'games',
            icon: '🧠'
        },
        {
            title: 'Tic Tac Toe',
            image: tic,
            description:
                ' Tic-Tac-Toe helps improve decision-making,' +
                ' pattern recognition, and tactical planning in just a few moves.',
            navigateTo: '/tic',
            navigator: navigateTo,
            category: 'games',
            icon:'✔️'
        },
        {
            title: "Nutrition Tracker+",
            image: nutTrackerImg,
            description: "Monitor daily nutritional intake, set health goals, and maintain a balanced lifestyle with comprehensive tracking.",
            navigateTo: '/Tracker',
            navigator: navigateTo,
            category: 'health',
            icon: '🥗'
        },
        {
            title: 'Smart Task Manager',
            image: 'https://img.freepik.com/free-vector/todo-list-concept-illustration_114360-7860.jpg?w=740&t=st=1696117263~exp=1696117863~hmac=3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8',
            description: 'Organize tasks with priority settings, deadlines, and progress tracking. Stay productive and accomplish daily objectives.',
            navigateTo: '/TodoAndDone',
            navigator: navigateTo,
            category: 'productivity',
            icon: '✅'
        },
        {
            title: 'Mood Tracker Pro',
            image: moodyImg,
            description: 'Document your emotional journey with daily mood entries. Identify patterns and gain insights into mental well-being.',
            navigateTo: '/moody',
            navigator: navigateTo,
            category: 'health',
            icon: '😊'
        },
        {
            title: 'Digital Notebook Pro',
            image: 'https://img.freepik.com/free-vector/coming-soon-concept-illustration_114360-7861.jpg?w=740&t=st=1696117323~exp=1696117923~hmac=5c6d7e8f9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5',
            description: 'Capture ideas, notes, and inspiration in one organized space. Advanced formatting and collaboration features.',
            navigateTo: '/course',
            navigator: navigateTo,
            category: 'education',
            icon: '📓'
        },
        {
            title: 'Language Mastery',
            image: 'https://tse4.mm.bing.net/th/id/OIP.PMRRjYlgOPwDQ1W-Z0l2_gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
            description: 'Monitor Spanish language learning with progress tracking, vocabulary builders, and skill assessment tools.',
            navigateTo: '/language',
            navigator: navigateTo,
            category: 'education',
            icon: '🇪🇸'
        },
        {
    title: 'Exam Planner Pro',
    image: 'https://img.freepik.com/free-vector/exam-preparation-concept-illustration_114360-12347.jpg?w=740&t=st=1696117500~exp=1696118100~hmac=ghi789',
    description: 'Plan your exam preparation with subject tracking, progress analytics, coverage monitoring, and exam probability assessment.',
    navigateTo: '/exam-preparation',
    navigator: navigateTo,
    category: 'Education',
    icon: '📚',

}

    ];

    const filteredCards = activeCategory === 'all' 
        ? cards 
        : cards.filter(card => card.category === activeCategory);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Header headerProps={{
                title: 'GPA Productivity Suite',
                navLinks: [
                    { label: 'Todo Manager', path: '/TodoAndDone' },
                    { label: 'Mood Tracker', path: '/moody' },
                    { label: 'Memory Game', path: '/memorygame' },
                    { label: 'Weather', path: '/weather' }
                ]
            }} />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16 mt-12">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                        Your Productivity Hub
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                        Discover powerful tools designed to enhance your daily life, 
                        boost productivity, and support your personal growth journey.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                            <span className="font-semibold">{cards.length}+</span> Tools Available
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                            <span className="font-semibold">100%</span> Free Access
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                activeCategory === 'all' 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            🌟 All Features
                        </button>
                        {Object.entries(categories).map(([key, category]) => (
                            <button
                                key={key}
                                onClick={() => setActiveCategory(key)}
                                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                    activeCategory === key 
                                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg` 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {category.title}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                {/* Category Header */}
                {activeCategory !== 'all' && categories[activeCategory] && (
                    <div className={`text-center mb-12 p-8 rounded-2xl ${categories[activeCategory].bgColor}`}>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            {categories[activeCategory].title}
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Explore tools specifically designed for {categories[activeCategory].title.toLowerCase()}
                        </p>
                    </div>
                )}

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredCards.map((card, index) => (
                        <CardView key={index} card={card} index={index} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredCards.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-600 mb-2">No features found</h3>
                        <p className="text-gray-500">Try selecting a different category</p>
                    </div>
                )}
            </main>

            {/* Stats Footer */}
            <footer className="bg-white border-t border-gray-200 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">{cards.length}</div>
                            <div className="text-gray-600">Powerful Tools</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-600 mb-2">{Object.keys(categories).length}</div>
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
            </footer>
        </div>
    );
}