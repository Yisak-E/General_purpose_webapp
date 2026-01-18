'use client';

import { createContext, useContext, useEffect, useState } from "react";


import { db } from "@/api/firebaseConfigs";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    doc,
    setDoc,
    getDoc,
    QueryDocumentSnapshot,
    DocumentData,
    snapshotEqual,
    updateDoc,
} from "firebase/firestore";
    

/** * Study Plan Context Type Definition
 * @property 
 */
type StudyPlanContextType = {
    studyPlans: StudyPlanType[];
   
    changeCourseStatus:(course_code: string) => Promise<void>;
    updatePlan: (planId: string, data: Partial<StudyPlanType>) => Promise<void>;
};

export const StudyPlanContext = createContext<StudyPlanContextType | null>(null);


export const StudyPlanContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [studyPlans, setStudyPlans] = useState<StudyPlanType[]>([]);
   
    
    useEffect(() => {
        const q = query(collection(db, "studyPlans"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const plans: StudyPlanType[] = snapshot.docs.map((d: QueryDocumentSnapshot<DocumentData>) => {
                    const data = d.data();
                    return {
                        id: d.id,
                        program: data.program,
                        semesters: data.semesters,
                        total_credit_hours: data.total_credit_hours,
                    } satisfies StudyPlanType;
                });

                setStudyPlans(plans);
            },
            (error) => {
                console.error("Error fetching study plans: ", error);
            }
        );

        return () => unsubscribe();
    }, []);

    const changeCourseStatus = async (course_code: string) => {
        try {
            const planRef = doc(db, "studyPlans", studyPlans[0].id);
            const planSnap = await getDoc(planRef);
            if (planSnap.exists()) {
                const planData = planSnap.data() as StudyPlanType;
                const updatedSemesters = planData.semesters.map((semester) => {
                    const updatedCourses = semester.courses.map((c) => {
                        if (c.code === course_code) {
                            return { ...c, taken: !c.taken };
                        }
                        return c;
                    });
                    return { ...semester, courses: updatedCourses };
                });

                await updateDoc(planRef, { semesters: updatedSemesters });
            }
        } catch (error) {
            console.error("Error changing course status:", error);
        }
    };


   

    const updatePlan = async (planId: string, data: Partial<StudyPlanType>) => {
        try {
            const planRef = doc(db, "studyPlans", planId);
            await updateDoc(planRef, data as any);
        } catch (error) {
            console.error("Error updating study plan:", error);
        }
    };


    return (
        <StudyPlanContext.Provider value={{
            studyPlans,
            changeCourseStatus,
            updatePlan,
        }}>
            {children}
        </StudyPlanContext.Provider>
    );
}

export const useStudyPlanContext = () => {
    const context = useContext(StudyPlanContext);
    if (!context) {
        throw new Error("useStudyPlanContext must be used within a StudyPlanContextProvider");
    }
    return context;
}



 export interface StudyPlanType {
    id: string;
    program: string;
    semesters: SemesterType[];
    total_credit_hours: number;
}   
    


export type CourseType = {
    code: string;
    credits: number;
    taken: boolean;
    title: string;
}

export type SemesterType = {
    name: string;
    year: string;
    total_credits: number;
    courses: CourseType[];
}