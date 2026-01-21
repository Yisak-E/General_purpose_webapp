'use client';


import { usePathname, useRouter} from "next/navigation";
import { useEffect, useState } from "react";


interface HeaderProps {
    title: string;
    navLinks: {label: string, path: string}[];
}

export default function Header({ title, navLinks }: HeaderProps) {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isLandingPage = pathname === '/dashboard' || pathname === '/';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


     const navigateTo = (navData: string) => {
        router.push(navData);
        setIsMobileMenuOpen(false); // Close mobile menu on navigation
    }

    return (

        <header className={`
             top-0 left-0 right-0 z-50
            transition-all duration-500
            
            ${isScrolled 
                ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50' 
                : 'bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200/30'
            }
        `}>
             <div className="container mx-auto px-4 py-3 lg:py-4">
                <div className="flex items-center justify-between">

                    {/* Logo and Title - Left Side */}
                    <div
                        className="flex items-center space-x-4 lg:space-x-6 cursor-pointer group"
                         onClick={() => navigateTo(isLandingPage ? "/" : "/dashboard")}
                    >
                       
                        <h1
                            
                         className={`
                            font-bold transition-all duration-500
                            ${isScrolled 
                                ? 'text-2xl lg:text-3xl' 
                                : 'text-2xl lg:text-4xl'
                            }
                            bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent
                            group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-blue-900
                        `}>
                            {title}
                        </h1>
                    </div>

                    
                    {/* Desktop Navigation - Center */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {!isLandingPage && navLinks.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => navigateTo(link.path)}
                                className={`
                                    relative
                                    px-6 py-3
                                    font-semibold
                                    rounded-xl
                                    transition-all duration-300
                                    transform hover:scale-105
                                    overflow-hidden
                                    group
                                    ${pathname === link.path
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl'
                                        : 'text-gray-600 hover:text-gray-800 bg-gray-100/50 hover:bg-white shadow-md hover:shadow-xl'
                                    }
                                `}
                            >
                                {/* Animated background */}
                                <div className={`
                                    absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 
                                    transition-transform duration-500
                                    ${pathname === link.path 
                                        ? 'scale-100' 
                                        : 'scale-0 group-hover:scale-100'
                                    }
                                `}></div>

                                {/* Content */}
                                <span className="relative z-10 flex items-center space-x-2">
                                    <span>{link.label}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-300 ${
                                            pathname === link.path ? 'rotate-45' : 'group-hover:rotate-45'
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>

                                {/* Active indicator */}
                                {pathname === link.path && (
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-full"></div>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* CTA Section - Right Side */}
                    <div className="flex items-center space-x-3">
                        {/* Get Started Button - Desktop */}
                        {isLandingPage && (
                            <button
                                onClick={() => navigateTo("/home")}
                                className="
                                    hidden lg:flex
                                    items-center space-x-2
                                    px-8 py-3
                                    bg-gradient-to-r from-blue-500 to-purple-600
                                    text-white font-bold
                                    rounded-xl
                                    transition-all duration-500
                                    transform hover:scale-105 hover:from-blue-600 hover:to-purple-700
                                    shadow-2xl hover:shadow-3xl
                                    relative overflow-hidden
                                    group
                                "
                            >
                                {/* Animated background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                                <span className="relative z-10">🚀 Get Started</span>
                                <svg className="w-4 h-4 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="
                                lg:hidden
                                p-3
                                bg-gradient-to-r from-blue-500 to-purple-600
                                text-white
                                rounded-xl
                                transition-all duration-300
                                transform hover:scale-105
                                shadow-lg
                            "
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                        <div className="p-4 space-y-2">
                            {/* Get Started Button - Mobile */}
                            {isLandingPage && (
                                <button
                                    onClick={() => navigateTo("/home")}
                                    className="
                                        w-full
                                        flex items-center justify-center space-x-2
                                        px-6 py-4
                                        bg-gradient-to-r from-blue-500 to-purple-600
                                        text-white font-bold
                                        rounded-xl
                                        transition-all duration-300
                                        transform hover:scale-105
                                        shadow-lg
                                    "
                                >
                                    <span>🚀 Get Started</span>
                                </button>
                            )}

                            {/* Navigation Links - Mobile */}
                            {!isLandingPage && navLinks.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => navigateTo(link.path)}
                                    className={`
                                        w-full
                                        flex items-center justify-between
                                        px-6 py-4
                                        font-semibold
                                        rounded-xl
                                        transition-all duration-300
                                        transform hover:scale-105
                                        ${location.pathname === link.path
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }
                                    `}
                                >
                                    <span>{link.label}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            {!isLandingPage && (
                <div className="w-full h-1 bg-gray-200/50">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                        style={{
                            width: `${(() => {
                                const currentPath = pathname;
                                const totalPaths = navLinks.length;
                                const currentIndex = navLinks.findIndex(link => link.path === currentPath);
                                return currentIndex >= 0 ? ((currentIndex + 1) / totalPaths) * 100 : 0;
                            })()}%`
                        }}
                    ></div>
                </div>
            )}
        </header>
    );
}