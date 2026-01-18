'use client';

import {  useStudyPlanContext } from "@/context/StudyPlanContext";
import {CourseType} from "@/context/StudyPlanContext";
import {  useState } from "react";

export default function StudyPlanClient() {
    const {studyPlans, changeCourseStatus} = useStudyPlanContext();
    const [selectedSemester, setSelectedSemester] = useState<number>(0);

    if (studyPlans.length === 0) {
        return <div>No study plans available.</div>;
    }

    const activePlan = studyPlans[0];
    const activeSemester = activePlan.semesters[selectedSemester];
    

    const calculatePercentage = () => {
       
            const completed = activePlan.semesters.reduce((semTotal, semester) => {
                const semCompleted = semester.courses.reduce((courseTotal, course) => {
                    return courseTotal + (course.taken ? course.credits : 0);
                }, 0);
                return semTotal + semCompleted;
            }, 0);
           
    
        const totalCredits = activePlan.total_credit_hours;
        return totalCredits === 0 ? 0 : Math.round((completed / totalCredits) * 100);

    }


    const completedCourses  = (courses: CourseType[]) => {
        const completedCredits = courses
            .filter(course => course.taken).length;

        const totalCoursesInSemester = courses.length;
         return {completedCredits, totalCoursesInSemester};
    };


    return (
        <div className="w-full mt-10 mx-auto lg:px-8 px-4">
           
            <div className="mb-8  ">
                <div className=" flex flex-col border p-4 rounded-lg shadow-lg bg-white">
                    <div className="flex justify-between ">
                        <div className="p-2">
                            <h2 className="text-2xl font-bold">Program: {activePlan.program} </h2>
                            <p>Total Credit Hours: {activePlan.total_credit_hours}</p>
                        </div>
                        
                        <div className="flex flex-col items-end justify-center p-2">
                            <h2 className={"text-lg font-semibold"}>{calculatePercentage()}% Completed</h2>
                        </div>
                    </div>

                    <div className="w-full my-4 h-4 bg-gray-200 rounded-lg px-2">
                        <div className={`rounded-xl h-4 bg-green-500`}
                             style={{ width: `${calculatePercentage()}%`}}>
                        </div>
                    </div>

                </div>

                        
                <article className={" w-full grid lg:grid-cols-5 gap-4 mt-4"}>
                    <aside   className=" overflow-y-auto lg:col-span-1 border-r p-2 lg:h-[400px] h-[200px]  min-w-[150px] p-2 w-full gap-2 border rounded-lg bg-amber-50">
                    { activePlan.semesters.map((semester, index) => (
                        
                        <div key={index} className={`col-span-1 m-2 border-b-2 p-2 rounded-l hover:bg-blue-100 ${selectedSemester === index ? "bg-blue-300" : ""}`} onClick={() => setSelectedSemester(index)}>
                            <h3 className="font-semibold text-lg">{semester.name}</h3>
                            <p className="text-gray-700">{semester.year}</p>
                            <p>{completedCourses (semester.courses).completedCredits} / {completedCourses (semester.courses).totalCoursesInSemester} completed</p>
                        </div>
                    
                        ))}
                    </aside>

                    <section className="lg:col-span-4 border p-2 w-full overflow-x-auto">
                        <h2></h2>
                        <SemesterTable courses={activeSemester.courses} statusChanger={changeCourseStatus} />

                    </section>
                </article>
                            
                       
                        
            </div> 
        </div>
    );
}

interface SemesterTableProps {
    courses: CourseType[];
    statusChanger: (course_code: string) => void;
}
function SemesterTable({ courses, statusChanger }: SemesterTableProps) {
    return (
        <table className="w-full p-4 border-collapse">
            <thead>
                <tr>
                    <th className="px-4 py-4 text-center lg:w-1/7 ">Code</th>
                    <th className="px-4 py-4 text-center">Title</th>
                    <th className="px-4 py-4 text-center lg:w-1/5 ">Credits</th>
                    <th className="px-4 py-4 text-center">Status</th>
                    <th className="px-4 py-4 text-center lg:w-1/7 ">Action</th>
                </tr>
            </thead>
            <tbody>
                {courses.map((course, index) => (
                    <tr key={course.code} className={`border-t ${index % 2 === 0 ? "bg-gray-200" : "bg-white"}`}>
                        <td className="px-4 py-4 text-center lg:w-1/7 ">{course.code}</td>
                        <td className="px-4 py-4 text-center">{course.title}</td>
                        <td className="px-4 py-4 text-center lg:w-1/5 ">{course.credits}</td>
                        <td className="px-4 py-4 text-center">{course.taken ? "Completed" : "Pending"}</td>
                        <td className="px-4 py-4 text-center lg:w-1/7 ">
                            <button 
                                onClick={() => statusChanger(course.code)}
                            className={`px-3 py-1 rounded ${!course.taken ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
                                {course.taken ? "untake" : "Complete"}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

