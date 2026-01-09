'use client';

import TextTypingAnim from "@/animations/TextTypingAnim";

interface HeroProps {
    categories: string[];
}


export default function Hero({ categories }: HeroProps) {
    return (
        <section className="text-center py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
           <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                    Your All-in-One <span className="text-yellow-300">Productivity</span> Suite</h1>

                <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                   <TextTypingAnim text='Discover a comprehensive collection of tools designed to enhance your daily life,
                    boost productivity, and support your personal growth journey.'/>
                </p>

                <button>
                    🚀 Get Glimpse - Explore All Features
                </button>
           </div>
        </section>  
       
    )
}