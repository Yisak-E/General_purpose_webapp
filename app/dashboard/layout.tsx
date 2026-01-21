import Footer from "@/components/sections/Footer";
import Header from "@/ui/Header";


const navLinks = [
                    { label: 'Jobs', path: '/dashboard/jop' },
                    { label: 'Mood Tracker', path: '/dashboard/mood' },
                    { label: 'Memory Game', path: '/dashboard/game/memory' },
                    { label: 'Weather', path: '/dashboard/weather' }
                ];

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col w-full">
            <Header title="General" navLinks={navLinks} />
            <main className="flex-grow bg-gray-50 w-full ">
                <div className=" ">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}