import { useNavigate } from 'react-router-dom'
import scheduleImg from '../assets/schedule.jpg';
import studyplanImg from '../assets/studyplan.jpg';
import jopsearchImg from '../assets/jopSearch.jpg';
import '../general.css'
import Header from "./headers/Header.jsx";


const CardView = ({card})=>{

    return(
            <div className={'col-4 bg-gray-200 cursor-pointer m-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300'}
              onClick={() => (card.navigator(card.navigateTo))}>
                <h3 className={'text-center text-xl font-bold p-4'}>{card.title}</h3>
                <div className="grid gap-2 ">
                    <img src={card.image} alt={card.title} className="rounded-circle home_img " />
                 </div>
                <pre className={'w-50 text-wrap p-3 hover:bg-gray-300 mx-auto rounded-3xl'}>{card.description}</pre>

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
            image: jopsearchImg,
            description: 'Optimized job search engine to find your dream job',
            navigateTo: '/jobSearch',
            navigator: navigateTo
        }
    ];

    return (
        <>
                <div className={'container p-0 m-0 min-w-full min-h-screen'}>

                        <Header headerProps={{
                            title: 'General Purpose Application',
                            navLinks: [
                                { label: 'Schedules', path: '/schedule' },
                                { label: 'Study Plan', path: '/studyPlan' },
                                { label: 'Job Search', path: '/jobSearch' }
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
