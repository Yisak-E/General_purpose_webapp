'use client';

import CategoryFiltration from "@/components/sections/CategoryFiltration";
import MobileNavigation from "@/components/sections/MobileNavigation";
import { Feature } from "@/type";
import React, { useCallback, useEffect } from "react";

interface SlideShowProps {
    features: Feature[];
    categories: string[];
}

export default function SlideShow({features, categories}: SlideShowProps) {

    const [currentSlide, setCurrentSlide] = React.useState(0);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % features.length);
  }, [features.length]);

  const goToPreviousSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + features.length) % features.length);
  }, [features.length]);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            goToNextSlide();
        }, 5000); 

        return () => clearInterval(slideInterval);
  }, [features.length, goToNextSlide]);
    return (
        <section className="py-16 px-4 bg-gray-900 border-t rounded-3xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From productivity tools to wellness trackers, our suite offers comprehensive
              solutions for modern life challenges.
            </p>
          </div>

     {/* Category Filters */}
         <CategoryFiltration categories={categories} />
    

   
    <div className="relative ">
      {/* Slideshow */}
      <div className="overflow-hidden rounded-2xl  shadow-xl">
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
    <MobileNavigation features={features} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
  </div>
</section>
    )
}