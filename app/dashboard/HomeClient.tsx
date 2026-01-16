'use client';

import { NavFeatures } from "@/type";
import CardView from "@/ui/CardView";
import { useState } from "react";

export type Category ={
    title: string;
    color: string;
    bgColor: string;
}

const categories : Record<string, Category> = {
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


interface HomeClientProbs {
 cards: NavFeatures[];
}

export default function HomeClient({ cards }: HomeClientProbs) {
    const [activeCategory, setActiveCategory] = useState< string>('all');


    const filteredCards = activeCategory === 'all' 
        ? cards 
        : cards.filter(card => card.category === activeCategory);

    return (
        <div className="w-full  flex flex-col items-center justify-start pt-10 px-4 bg-black mt-0 ">
           
            {/* Category Filters */}
             <section className="py-8  backdrop-blur-sm  top-0 z-10   bg-black">
                <div className="container mx-auto px-4  bg-black">
                    <div className="flex flex-wrap justify-center gap-3 bg-black/80">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                activeCategory === 'all' 
                                    ? 'bg-gradient-to-r from-green-500 to-yellow-600 text-white shadow-lg' 
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
            
        </div>
    )
}