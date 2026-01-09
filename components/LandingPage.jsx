import { useNavigate } from "react-router-dom";

import '../general.css';

// Import your images
import scheduleImg from '../assets/schedule.jpg';
import studyplanImg from '../assets/studyplan.jpg';
import jopSearchImg from '../assets/jopSearch.jpg';
import weatherImg from '../assets/weatherabu.png';
import nutTrackerImg from '../assets/nut_tracker.jpg';
import moodyImg from '../assets/img.png';
import {useEffect, useState} from "react";

export default function LandingPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    const goToNextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    };

    const goToPreviousSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
    };

  useEffect(() => {
      const interval = setInterval(goToNextSlide, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }, []);

    

    const categories = [...new Set(features.map(feature => feature.category))];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

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

{/* Features Overview - Slideshow Version */}
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

    {/* Slideshow Container */}
    <div className="relative">
      {/* Slideshow */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="relative h-96 md:h-[500px]">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                currentSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="md:w-1/2 relative overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-full p-3">
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <div className="absolute top-6 right-6 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {feature.category}
                  </div>
                </div>

                {/* Content Section */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-blue-600 font-semibold text-lg">
                      Explore Feature →
                    </span>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{index + 1}</span>
                      <span>/</span>
                      <span>{features.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPreviousSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 z-10"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 z-10"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="flex justify-center space-x-3 mt-6">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-blue-500 w-8' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>

    {/* Mobile Navigation Dots */}
    <div className="flex justify-center space-x-2 mt-8 md:hidden">
      {features.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentSlide(index)}
          className={`w-2 h-2 rounded-full ${
            currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        />
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