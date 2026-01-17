import { NavFeatures } from "@/type";
import HomeClient from "./HomeClient";

const cards: NavFeatures[] = [
        // {
        //     title: 'Smart Scheduler',
        //     image: "/assets/schedule.jpg",
        //     description: 'Organize your weekly activities with our intuitive scheduling system. Plan your days, set reminders, and never miss important deadlines.',
        //     navigateTo: '/dashboard/tasks/schedule',
        //     category: 'productivity',
        //     icon: '📅'
        // },
        // {
        //     title: 'Study Plan Creator',
        //     image: "/assets/studyplan.jpg",
        //     description: 'Design personalized study schedules that adapt to your learning style. Track progress and optimize your study sessions.',
        //     navigateTo: '/dashboard/tasks/studyPlan',
        //     category: 'education',
        //     icon: '📚'
        // },
        {
            title: 'Job Search Pro',
            image: "/assets/virtualJooSearch.png",
            description: 'Streamline your job hunting with smart filters and application tracking. Find your dream career with personalized recommendations.',
            navigateTo: '/dashboard/jop',

            category: 'productivity',
            icon: '💼'
        },
        {
            title: 'Live Weather Dashboard',
            image: "/assets/weatherabu.png",
            description: 'Get real-time weather forecasts with advanced metrics. Plan your day with accurate atmospheric conditions and predictions.',
            navigateTo: '/dashboard/weather',
            category: 'utilities',
            icon: '🌤️'
        },
        {
            title: 'Memory Challenge Pro',
            image: '/assets/memory.png',
            description: 'Boost cognitive skills with engaging memory games. Multiple difficulty levels to challenge and improve concentration.',
            navigateTo: '/dashboard/game/memory',
            category: 'games',
            icon: '🧠'
        },
        {
            title: 'Tic Tac Toe',
            image: '/assets/tic.png',
            description:
                ' Tic-Tac-Toe helps improve decision-making,' +
                ' pattern recognition, and tactical planning in just a few moves.',
            navigateTo: '/dashboard/game/tictactoe',
            category: 'games',
            icon:'✔️'
        },
        {
            title: "Nutrition Tracker+",
            image: "/assets/nut_tracker.jpg",
            description: "Monitor daily nutritional intake, set health goals, and maintain a balanced lifestyle with comprehensive tracking.",
            navigateTo: '/dashboard/tasks/nutritionTracker',
            category: 'health',
            icon: '🥗'
        },
        // {
        //     title: 'Smart Task Manager',
        //     image: '/assets/tasktrack.png',
        //     description: 'Organize tasks with priority settings, deadlines, and progress tracking. Stay productive and accomplish daily objectives.',
        //     navigateTo: '/dashboard/tasks/todo',
        //     category: 'productivity',
        //     icon: '✅'
        // },
        {
            title: 'Mood Tracker Pro',
            image: "/assets/moody.png",
            description: 'Document your emotional journey with daily mood entries. Identify patterns and gain insights into mental well-being.',
            navigateTo: '/dashboard/mood',
            category: 'health',
            icon: '😊'
        },
    //     {
    //         title: 'Digital Notebook Pro',
    //         image: 'https://img.freepik.com/free-vector/coming-soon-concept-illustration_114360-7861.jpg?w=740&t=st=1696117323~exp=1696117923~hmac=5c6d7e8f9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5',
    //         description: 'Capture ideas, notes, and inspiration in one organized space. Advanced formatting and collaboration features.',
    //         navigateTo: '/course',
    //         category: 'education',
    //         icon: '📓'
    //     },
    //     {
    //         title: 'Language Mastery',
    //         image: 'https://tse4.mm.bing.net/th/id/OIP.PMRRjYlgOPwDQ1W-Z0l2_gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    //         description: 'Monitor Spanish language learning with progress tracking, vocabulary builders, and skill assessment tools.',
    //         navigateTo: '/language',
    //         category: 'education',
    //         icon: '🇪🇸'
    //     },
    //     {
    //     title: 'Exam Planner Pro',
    //     image: "https://cdn.pixabay.com/photo/2018/09/04/10/23/boy-3653385_1280.jpg",
    //     description: 'Plan your exam preparation with subject tracking, progress analytics, coverage monitoring, and exam probability assessment.',
    //     navigateTo: '/exam-preparation',
    //     category: 'education',
    //     icon: '📚',

    //  },

    ];


export default function DashboardPage(){

    const categories = [...new Set(cards.map( (card)=> card.category))];
    return (
        <main>
           <HomeClient cards={cards}  />
        </main>
    );

}