import logo from '../../assets/gpa.png';
import {useNavigate} from "react-router-dom";

export default function Header({headerProps}) {
    const nav = useNavigate();

    const navigateTo = (navData) => {
        nav(navData);
    }

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
                {/* Mobile Layout - Stacked */}
                <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">

                    {/* Logo and Title - Mobile Stacked, Desktop Side by Side */}
                    <div className="flex flex-col items-center space-y-3 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-12 w-auto cursor-pointer transition-transform hover:scale-105 lg:h-16"
                            onClick={() => navigateTo("/")}
                        />
                        <h1 className="text-xl font-bold text-gray-800 text-center lg:text-3xl">
                            {headerProps.title}
                        </h1>
                    </div>

                    {/* Navigation - Mobile Full Width, Desktop Auto */}
                    <nav className="w-full lg:w-auto">
                        <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
                            {headerProps.navLinks.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => navigateTo(link.path)}
                                    className="
                                        w-full sm:w-auto
                                        px-4 py-2
                                        text-sm font-medium
                                        bg-blue-600 text-white
                                        rounded-lg
                                        hover:bg-blue-700
                                        active:bg-blue-800
                                        transition-all duration-200
                                        transform hover:scale-105
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                        lg:px-4 lg:py-2 lg:text-base
                                        shadow-md hover:shadow-lg
                                    "
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}