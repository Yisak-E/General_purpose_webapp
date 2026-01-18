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
} from "firebase/firestore";
import { FirebaseError } from 'firebase/app';
import { s } from "motion/react-client";

/** * Study Plan Context Type Definition
 * @property 
 */
type StudyPlanContextType = {
    getPlans: () => void;
    updatePlan: (planId: string, data: any) => void;
};

export const StudyPlanContext = createContext<StudyPlanContextType | null>(null);


export const StudyPlanContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [studyPlans, setStudyPlans] = useState<StudyPlanType[]>([]);

    
useEffect(() => {
        console.log("StudyPlanContextProvider mounted", studyPlans);
 
}, [studyPlans]);

    const getPlans = async () => {
       

        try{
           const q = query(
            collection(db, "studyPlans"),
           );

           const snap = await new Promise((resolve, reject) => {
            onSnapshot(q, (snapshot) => {
                resolve(snapshot);
            }, (error) => {
                reject(error);
            });
           });

           const plans: StudyPlanType[] = (snap as { docs: QueryDocumentSnapshot<DocumentData>[] }).docs.map((d) => {
            const data = d.data();
            return {
                id: d.id,
                Program: data.Program,
                semesters: data.semesters,
                total_credit_hours: data.total_credit_hours,
            } satisfies StudyPlanType;
           });
           setStudyPlans(plans);
        
        }catch(error : any){
            console.error("Error fetching study plans: ", error);
        }
    };

    const updatePlan = (planId: string, data: any) => {
        // Implementation to update a study plan in Firestore
    };


    return (
        <StudyPlanContext.Provider value={{
            getPlans,
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
    Program: string;
    semesters: {
        courses:{
            code: string;
            credits: number;
            taken: boolean;
            title: string;
        }[];
        name: string;
        total_credits: number;
        year: string;

    }[];
    total_credit_hours: number;
}
