'use client';

import SlideShow from '@/animations/SlideShow';
import TextTypingAnim from '@/animations/TextTypingAnim';
import CategoryFiltration from '@/components/sections/CategoryFiltration';
import Footer from '@/components/sections/Footer';
import Hero from '@/components/sections/Hero';
import { Feature } from '@/type';
import { useEffect, useState } from 'react';

interface LandingPageProps {
    features: Feature[];
    categories: string[];
}

export default function LandingPage({ features, categories }: LandingPageProps) {

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

        {/* hero section  */}
        <Hero categories={categories} />

        {/* Features Overview - Slideshow Version */}
        <SlideShow features={features} categories={categories} />

       


            <Footer />

        </main>
    );
}