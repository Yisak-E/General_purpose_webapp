'use client';

import SlideShow from '@/animations/SlideShow';
import Footer from '@/components/sections/Footer';
import Hero from '@/components/sections/Hero';
import { Feature } from '@/type';
import { useRouter } from 'next/navigation';
import { use } from 'react';


interface LandingPageProps {
    features: Feature[];
    categories: string[];
}

export default function LandingPage({ features, categories }: LandingPageProps) {

    const navigate = useRouter();
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

        {/* hero section  */}
        <Hero categories={categories} />

        {/* Features Overview - Slideshow Version */}
        <SlideShow features={features} categories={categories} />


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
                     onClick={()=>{
                        navigate.push('/dashboard');
                     }}
                       
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
        <Footer />

        </main>
    );
}