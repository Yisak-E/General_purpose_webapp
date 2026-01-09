'use client';

import { useState } from "react";
import { NavFeatures } from "@/type";
import { useRouter } from "next/navigation";
interface CardViewProps {
    card: NavFeatures;
    index: number;
}

const CardView = ({ card, index }: CardViewProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const route = useRouter();

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
            onClick={() => route.push(card.navigateTo)}
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

export default CardView;