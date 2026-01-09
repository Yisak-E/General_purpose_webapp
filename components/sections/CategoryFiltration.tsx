'use client';

interface CategoryFiltrationProps {
    categories: string[];
}

export default function CategoryFiltration({categories}: CategoryFiltrationProps) {
    return (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
        <button className="px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all border border-gray-200 font-semibold text-gray-700 hover:bg-blue-50 ">
            All Features
        </button>
        {categories.map((category, index) => (
            <button
            key={index}
            className="px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all border border-gray-200 font-semibold text-gray-700 hover:bg-blue-50 animate-fade-in"
            >
            {category}
            </button>
        ))}
        </div>
    )
}