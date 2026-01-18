'use client';

import { useStudyPlanContext } from "@/context/StudyPlanContext";

export default function StudyPlanClient() {
    const {studyPlans} = useStudyPlanContext();


    return (
        <div>
            Study Plan Client Component
            {
                studyPlans.map(plan => (
                    <div key={plan.id} className="border p-4 mb-4">
                       
                        <h2 className="text-xl font-bold mb-2">{plan.Program}</h2>
                        <p>Total Credit Hours: {plan.total_credit_hours}</p>
                        <div className="mt-4">
                            {plan.semesters.map((semester, index) => (
                                <div key={index} className="mb-3">
                                    <h3 className="text-lg font-semibold">{semester.name} - {semester.year}</h3>
                                    <p>Total Credits: {semester.total_credits}</p>
                                    <ul className="list-disc list-inside">
                                        {semester.courses.map((course, cIndex) => (
                                            <li key={cIndex}>
                                                {course.code}: {course.title} ({course.credits} credits) - {course.taken ? 'Completed' : 'Pending'}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }

        </div>
    );
}