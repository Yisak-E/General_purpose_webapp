'use client';

import { createContext, useContext, useState } from "react";


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
} from "firebase/firestore";
import { FirebaseError } from 'firebase/app';

/** * Study Plan Context Type Definition
 * @property 
 */
type StudyPlanContextType = {
    getPlans: () => void;
    updatePlan: (planId: string, data: any) => void;
};

export const StudyPlanContext = createContext<StudyPlanContextType | null>(null);

    const getPlans = () => {
        // Implementation to get study plans from Firestore
        
    };

    const updatePlan = (planId: string, data: any) => {
        // Implementation to update a study plan in Firestore
    };


export const StudyPlanContextProvider = ({ children }: { children: React.ReactNode }) => {
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
