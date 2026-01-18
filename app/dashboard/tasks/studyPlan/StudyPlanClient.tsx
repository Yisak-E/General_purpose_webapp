'use client';

import { useStudyPlanContext } from "@/context/StudyPlanContext";
import {CourseType} from "@/context/StudyPlanContext";
import { div } from "motion/react-client";
import { useState } from "react";

export default function StudyPlanClient() {
    const {studyPlans} = useStudyPlanContext();
    const [selectedSemester, setSelectedSemester] = useState<number>(0);
    const [semesterList, setSemesterList] = useState<number[]>([]);

    const calculatePercentage = () => {
        const creditsCompleted = studyPlans.reduce((total, plan) => {
            const completed = plan.semesters.reduce((semTotal, semester) => {
                const semCompleted = semester.courses.reduce((courseTotal, course) => {
                    return courseTotal + (course.taken ? course.credits : 0);
                }, 0);
                return semTotal + semCompleted;
            }, 0);
            return total + completed;
        }, 0);
        const totalCredits = studyPlans.reduce((total, plan) => total + plan.total_credit_hours, 0);
        return totalCredits === 0 ? 0 : Math.round((creditsCompleted / totalCredits) * 100);

    }


    const perSemsterCompletion = (courses: CourseType[]) => {
        const completedCredits = courses
            .filter(course => course.taken).length;

        const totalCoursesInSemester = courses.length;
         return {completedCredits, totalCoursesInSemester};
    };


    return (
        <div className="container mt-10 mx-auto ">
            {
                studyPlans.map((plan) => (
                    <div key={plan.id} className="mb-8 border p-4">
                        <div className=" flex flex-col border">
                            <div className="flex justify-between border">
                                <div className="p-2">
                                    <h2 className="text-2xl font-bold">Program: {plan.program}</h2>
                                    <p>Total Credit Hours: {plan.total_credit_hours}</p>
                                </div>
                                
                                <div className="flex flex-col items-end justify-center p-2">
                                    <h2 className={"text-lg font-semibold"}>{calculatePercentage()}% Completed</h2>
                                </div>
                            </div>

                            <div className="w-full my-4 h-4 bg-gray-200 rounded-lg px-2">
                                <div className={`h-4 bg-green-500 w-[${calculatePercentage()}%]`}>

                                </div>
                            </div>

                        </div>

                          { plan.semesters.map((semester, index) => (
                             <article className={"border w-full grid grid-cols-5 gap-4 mt-4"}>
                        
                             <aside className={`col-span-1 border p-2 rounded-lg ${selectedSemester === index ? "bg-blue-200" : ""}`} onClick={() => setSelectedSemester(index)}>
                                <h3 className="font-semibold text-lg">{semester.name}</h3>
                                <p className="text-gray-700">{semester.year}</p>
                                <p>{perSemsterCompletion(semester.courses).completedCredits} / {perSemsterCompletion(semester.courses).totalCoursesInSemester} completed</p>
                            </aside>

                            <section className="col-span-4 border p-2">
                                <h2></h2>
                                <SemesterTable courses={semester.courses} />

                            </section>
                             </article>
                            ))}
                       
                        
                    </div>
                ))
            }
        </div>
    );
}

interface SemesterTableProps {
    courses: CourseType[];
}
function SemesterTable({ courses }: SemesterTableProps) {
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr>
                    <th className="px-4 py-2 text-center w-1/7 ">Code</th>
                    <th className="px-4 py-2 text-center">Title</th>
                    <th className="px-4 py-2 text-center w-1/5 ">Credits</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center w-1/7 ">Action</th>
                </tr>
            </thead>
            <tbody>
                {courses.map((course, index) => (
                    <tr key={course.code} className={`border-t ${index % 2 === 0 ? "bg-gray-200" : "bg-white"}`}>
                        <td className="px-4 py-2 text-center ">{course.code}</td>
                        <td className="px-4 py-2 text-center">{course.title}</td>
                        <td className="px-4 py-2 text-center ">{course.credits}</td>
                        <td className="px-4 py-2 text-center">{course.taken ? "Completed" : "Pending"}</td>
                        <td className="px-4 py-2 text-center ">
                            <button className={`px-3 py-1 rounded ${!course.taken ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
                                {course.taken ? "untake" : "Complete"}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
