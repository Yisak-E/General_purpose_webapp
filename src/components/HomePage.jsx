
import scheduleImg from '../assets/schedule.jpg';
import studyplanImg from '../assets/studyplan.jpg';
import jopSearchImg from '../assets/jopSearch.jpg';
import weatherImg from '../assets/weatherabu.png';
import nutTrackerImg from '../assets/nut_tracker.jpg';
import moodyImg from '../assets/img.png';
import '../general.css'
import Header from "./headers/Header.jsx";
import {useNavigate} from "react-router-dom";


const CardView = ({card})=>{

    return(
            <div className={'w-full my-3 flex flex-col align-middle  bg-gray-200 cursor-pointer m-auto rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 lg:flex-wrap lg:w-1/4 lg:mx-2 md:flex-wrap md:w-1/3 md:mx-1'}
              onClick={() => (card.navigator(card.navigateTo))}>
                <h3 className={'text-center text-xl font-bold p-4'}>{card.title}</h3>
                <div className="m-auto md:w-50 md:flex md:flex-col md:justify-start  ">
                    <img src={card.image} alt={card.title} className="rounded-circle home_img " />
                 </div>
                <pre className={'w-70 my-2 mx-auto p-3 hover:bg-gray-300 text-wrap rounded-3xl'}>{card.description}</pre>

            </div>

    )
}


export default function HomePage() {
    const nav = useNavigate();
        const navigateTo= (navData) => {
            nav(navData);
        }

    const cards = [
        {
            title: 'Schedules',
            image: scheduleImg,
            description: 'The schedule page will present a weekly time table',
            navigateTo: '/schedule',
            navigator: navigateTo
        },
        {
            title: 'Study Plan',
            image: studyplanImg,
            description: 'Create and manage your study plans effectively',
            navigateTo: '/studyPlan',
            navigator: navigateTo
        },
        {
            title: 'Job Search',
            image: jopSearchImg,
            description: 'Optimized job search engine to find your dream job',
            navigateTo: '/jobSearch',
            navigator: navigateTo
        },
        {
            title: 'Weather',
            image: weatherImg,
            description: 'Get real-time weather updates for your location',
            navigateTo: '/weather',
            navigator: navigateTo
        },
        {
            title:'Memory Game',
            image:'https://img.freepik.com/free-vector/memory-game-concept-illustration_114360-1921.jpg?w=740&t=st=1696117203~exp=1696117803~hmac=5a3e2f0f4e2e4fc1a4e3f8e6f4b5e6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k',
            description:'Play a fun and engaging memory game to boost your cognitive skills',
            navigateTo: '/memoryGame',
            navigator: navigateTo
        },
        {
            title: "nutrition tracker",
            image: nutTrackerImg,
            description: "Track your daily nutrition intake and maintain a healthy lifestyle",
            navigateTo: '/Tracker',
            navigator: navigateTo
        },
        {
            title: 'Todo And Done',
            image: 'https://img.freepik.com/free-vector/todo-list-concept-illustration_114360-7860.jpg?w=740&t=st=1696117263~exp=1696117863~hmac=3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8',
            description: 'Manage your tasks efficiently with our Todo And Done feature',
            navigateTo: '/TodoAndDone',
            navigator: navigateTo
        },{
            title:'Moody',
            image:moodyImg,
            description:'track your mood with your post 😃🤐🤨😋',
            navigateTo: '/moody',
            navigator: navigateTo
        },
        {
        title: 'NoteBook',
        image: 'https://img.freepik.com/free-vector/coming-soon-concept-illustration_114360-7861.jpg?w=740&t=st=1696117323~exp=1696117923~hmac=5c6d7e8f9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5',
        description: 'Stay tuned for more exciting features and updates!',
        navigateTo: '/course',
        navigator: navigateTo
        },
        {
            title: 'Language Tracker',
            image: 'https://tse4.mm.bing.net/th/id/OIP.PMRRjYlgOPwDQ1W-Z0l2_gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
            navigateTo: '/language',
             description: 'check your spanish language skill with language tracker',
            navigator: navigateTo
        }
    ];

    return (
        <>
                <div className={'container p-0 m-0 min-w-full min-h-screen'}>

                        <Header headerProps={{
                            title: 'GPA',
                            navLinks: [
                                { label: 'Todo', path: '/TodoAndDone' },
                                { label: 'Moody', path: '/moody' },
                                { label: 'Memory Game', path: '/memoryGame' }
                            ]
                        }} />


                    <p className={'text-center text-2xl p-3'}>Welcome to the Home Page!</p>
                    <div className={'row flex flex-wrap justify-evenly rounded-lg mt-3 ml-5 p-0'}>

                       {cards.map((card, index) => (
                        <CardView key={index} card={card} />
                         ))}

                    </div>

                </div>

        </>
    )
}
