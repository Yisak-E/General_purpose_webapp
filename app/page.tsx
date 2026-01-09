import Image from "next/image";
import './globals.css';
import LandingPage from "./LandingPage";
import type { Feature } from "../type/index";

const features : Feature[] = [
        {
            title: 'Smart Scheduler',
            image: "assets/schedule.jpg",
            description: 'Organize your weekly activities with our intuitive scheduling system. Plan your days, set reminders, and never miss important appointments or deadlines again.',
            icon: '📅',
            category: 'Productivity'
        },
        {
            title: 'Study Plan Creator',
            image: "assets/studyplan.jpg",
            description: 'Design personalized study schedules that adapt to your learning style. Track progress, set goals, and optimize your study sessions for maximum efficiency.',
            icon: '📚',
            category: 'Education'
        },
        {
            title: 'Job Search Assistant',
            image: "assets/virtualJooSearch.png",
            description: 'Streamline your job hunting process with smart filters, application tracking, and personalized recommendations tailored to your career goals.',
            icon: '💼',
            category: 'Career'
        },
        {
            title: 'Live Weather Updates',
            image: "assets/weatherabu.png",
            description: 'Get real-time weather forecasts for any location worldwide. Plan your day with accurate temperature, precipitation, and atmospheric conditions.',
            icon: '🌤️',
            category: 'Utility'
        },
        {
            title: 'Memory Challenge',
            image: 'https://img.freepik.com/free-vector/memory-game-concept-illustration_114360-1921.jpg?w=740&t=st=1696117203~exp=1696117803~hmac=5a3e2f0f4e2e4fc1a4e3f8e6f4b5e6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k',
            description: 'Boost your cognitive skills with engaging memory games. Multiple difficulty levels to challenge and improve your concentration and recall abilities.',
            icon: '🧠',
            category: 'Games'
        },
        {
            title: "Nutrition Tracker",
            image: "assets/nut_tracker.jpg",
            description: "Monitor your daily nutritional intake, set health goals, and maintain a balanced lifestyle with our comprehensive food tracking system.",
            icon: '🥗',
            category: 'Health'
        },
        {
            title: 'Smart Todo Manager',
            image: 'https://img.freepik.com/free-vector/todo-list-concept-illustration_114360-7860.jpg?w=740&t=st=1696117263~exp=1696117863~hmac=3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8',
            description: 'Organize tasks efficiently with priority settings, deadlines, and progress tracking. Stay productive and accomplish your daily objectives.',
            icon: '✅',
            category: 'Productivity'
        },
        {
            title: 'Mood Tracker',
            image: "assets/img.png",
            description: 'Document your emotional journey with daily mood entries. Identify patterns and gain insights into your mental well-being over time.',
            icon: '😊',
            category: 'Wellness'
        },
        {
            title: 'Digital Notebook',
            image: 'https://img.freepik.com/free-vector/coming-soon-concept-illustration_114360-7861.jpg?w=740&t=st=1696117323~exp=1696117923~hmac=5c6d7e8f9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5',
            description: 'Capture ideas, notes, and inspiration in one organized space. Coming soon with advanced formatting and collaboration features.',
            icon: '📓',
            category: 'Productivity'
        },
        {
            title: 'Language Progress Tracker',
            image: 'https://tse4.mm.bing.net/th/id/OIP.PMRRjYlgOPwDQ1W-Z0l2_gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
            description: 'Monitor your Spanish language learning journey with progress tracking, vocabulary builders, and skill assessment tools.',
            icon: '🇪🇸',
            category: 'Education'
        }, {
            title: 'Exam Planner Pro',
            image: "https://cdn.pixabay.com/photo/2018/09/04/10/23/boy-3653385_1280.jpg",
            description: 'Plan your exam preparation with subject tracking, progress analytics, coverage monitoring, and exam probability assessment.',
            icon: '📚',
            category: 'Education'
        }

    ];

export default function Home() {

  const catogories: string[] = [...new Set(features.map((feature) => feature.category))]

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <LandingPage features={features}  categories={catogories}/>
    </div>
  );
}



