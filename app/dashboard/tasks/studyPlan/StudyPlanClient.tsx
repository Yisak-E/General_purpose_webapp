'use client';

import { useStudyPlanContext } from "@/context/StudyPlanContext";

export default function StudyPlanClient() {
    const {getPlans} = useStudyPlanContext();


    return (
        <div>
            Study Plan Client Component
            
        </div>
    );
}