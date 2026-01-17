'use client';

import { Feature } from "@/type";
interface MobileNavigationProps {
  features: Feature[];
    currentSlide: number;
    setCurrentSlide: (index: number) => void;
}

export default function MobileNavigation({ features, currentSlide, setCurrentSlide }: MobileNavigationProps) {
    return(
       
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
    )
}