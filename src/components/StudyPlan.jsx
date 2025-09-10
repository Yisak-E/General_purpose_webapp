//import {useNavigate } from 'react-router-dom'
import Footer from "./Footer.jsx";
import {useState} from "react";
import Header from "./headers/Header.jsx";
import studyplan from "../data/studyplan.json"

function StudyPlan() {
    //const nav = useNavigate();
    const [selectedSemester, setSelectedSemester] = useState("semester 1");

  return (
   <>
   <div className={'container min-w-full px-2 py-0 min-h-screen'}>
       <Header headerProps={
           {
               title: 'Study Plan',
               navLinks: [
                   {label: 'Home', path: '/'},
                   {label: 'Schedules', path: '/schedule'},
                   {label: 'Job Search', path: '/jobSearch'}
               ]
           }
       }/>


       <section className="grid gap-2 bg-gray-300 wx-50 p-4 rounded-lg">
            <h1 className={'text-center text-2xl'}>{studyplan.program}
                <span className={'text-green-700 font-bold ml-36'}> Total credit hours:</span>
                {studyplan.total_credit_hours}</h1>
           <div className={'grid gap-2'}>
               <div className={'left-side-nav'}>

               </div>

                <div className={'right-side-view '}>
                    {
                        studyplan.semesters.map((semester, index) => {

                            return (
                                <div key={index}>
                                    <h2 key={semester.name+index} className={'text-center text-xl font-bold my-2 hover:underline'}
                                    onClick={() => setSelectedSemester(semester)}>{semester.name}</h2>
                                    {
                                        (selectedSemester.name === semester.name)?
                                             <table key={semester.name+index} className="min-w-full bg-white border">
                                        <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b">Course Code</th>
                                            <th className="py-2 px-4 border-b">Course Name</th>
                                            <th className="py-2 px-4 border-b">Credit Hours</th>
                                            <th className="py-2 px-4 border-b">Taken</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {semester.courses.map((course, courseIndex) => (
                                            <tr key={course.code + courseIndex}>
                                                <td className="py-2 px-4 border-b">{course.code}</td>
                                                <td className="py-2 px-4 border-b">{course.title}</td>
                                                <td className="py-2 px-4 border-b">{course.credits}</td>
                                                {
                                                    (course.taken)?
                                                        <td className="py-2 px-4 border-b text-green-600 font-bold">Yes</td> :
                                                        <td className="py-2 px-4 border-b text-red-600 font-bold">No</td>

                                                }
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="py-2 px-4 border-b font-bold" colSpan="2">Total Credit Hours</td>
                                            <td className="py-2 px-4 border-b font-bold">{semester.total_credits}</td>
                                        </tr>
                                        </tbody>
                                    </table>:
                                    <div>
                                        <p className={'text-center'}>Click to view courses</p>
                                    </div>

                                    }

                                </div>
                            )


                        })

                    }

                </div>
           </div>


       </section>


   </div>

   </>

  );
}

export default StudyPlan;
