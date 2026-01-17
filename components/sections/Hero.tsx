'use client';

import RotateScaleAnim from "@/animations/RotateScaleAnim";
import TextTypingAnim from "@/animations/TextTypingAnim";

interface HeroProps {
    categories: string[];
}


export default function Hero({ categories }: HeroProps) {
    return (
        <section className="text-center py-10 px-4  bg-black  text-white relative overflow-hidden">
           <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                    Your All-in-One <span className="text-yellow-300">Productivity</span> Suite</h1>

                <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                   <TextTypingAnim text='Discover a comprehensive collection of tools designed to enhance your daily life,
                    boost productivity, and support your personal growth journey.'/>
                </p>

                                {categories.length > 0 && (
                                    <p className="mb-6 text-sm text-blue-300">
                                        Explore {categories.length} feature categories tailored to your needs.
                                    </p>
                                )}


                <button>
                   <RotateScaleAnim text="🚀" />
                    Get Glimpse - Explore All Features
                     <RotateScaleAnim text="🚀" />
                </button>
           </div>
        </section>  
       
    )
}