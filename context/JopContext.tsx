'use client';

import { db } from "@/api/firebaseConfigs";
import axios from "axios";
import { JopSearchType, JSearchJob } from "@/type/jopSearchType";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface JopContextType {
  // Define context value types if needed
    jopLists: JSearchJob[];
    addJop: (newJop: JSearchJob) => Promise<void>;
    updateJop: (updatedJop: JSearchJob) => Promise<void>;
    deleteJop: (jobId: string) => Promise<void>;
    searchJop: (query: JopSearchType) => Promise<void>;
}




const JopContext =createContext<JopContextType | null>(null);

export function  JopProvider({ children }: { children: React.ReactNode }) {
    const [jopLists, setJopLists] = useState<JSearchJob[]>([]);
    const editorRef = useRef<HTMLDivElement | null>(null);

    // loading jopLists from firestore 
    useEffect(()=>{
        const q = query(
            collection(db, "jopLists"),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snap)=>{
            setJopLists(
                snap.docs.map((d)=>{
                    const data = d.data();

                    return {
                        // Employer
                        employer_name: data.employer_name ?? null,
                        employer_logo: data.employer_logo ?? null,
                        employer_website: data.employer_website ?? null,
                        employer_company_type: data.employer_company_type ?? null,
                        employer_linkedin: data.employer_linkedin ?? null,
                        // Job identity
                        job_id: data.job_id,
                        job_title: data.job_title,
                        job_publisher: data.job_publisher ?? null,
                        job_employment_type: data.job_employment_type ?? null,
                        // Apply info
                        job_apply_link: data.job_apply_link ?? null,
                        job_apply_is_direct: data.job_apply_is_direct ?? null,
                        job_apply_quality_score: data.job_apply_quality_score ?? null,
                        apply_options: data.apply_options ?? null,
                        // Job content
                        job_description: data.job_description ?? null,
                        job_highlights: data.job_highlights ?? null,
                        job_benefits: data.job_benefits ?? null,
                        // Location
                        job_city: data.job_city ?? null,
                        job_state: data.job_state ?? null,
                        job_country: data.job_country ?? null,
                        job_latitude: data.job_latitude ?? null,
                        job_longitude: data.job_longitude ?? null,
                        // Dates
                        job_posted_at_timestamp: data.job_posted_at_timestamp ?? null,
                        job_posted_at_datetime_utc: data.job_posted_at_datetime_utc ?? null,
                        // Salary
                        job_min_salary: data.job_min_salary ?? null,
                        job_max_salary: data.job_max_salary ?? null,
                        job_salary_currency: data.job_salary_currency ?? null,
                        // Requirements
                        job_required_experience: data.job_required_experience ?? null,
                        job_required_skills: data.job_required_skills ?? null,
                        
                        
                    } as JSearchJob;
                })
            )
        })

    },[]);

    // adding functionality
    const addJop = async ( newJop: JSearchJob ) => {
        await setDoc(doc(db, "jopLists", newJop.job_id), {
            ...newJop,
            createdAt: serverTimestamp(),
        });
    };

    // updating functionality
    const updateJop = async ( updatedJop: JSearchJob ) =>{
        await updateDoc(doc(db, "jopLists", updatedJop.job_id), {
            ...updatedJop,
            updatedAt: serverTimestamp(),
        });
    }

    // deleting functionality
    const deleteJop = async ( jobId: string ) =>{
        await deleteDoc(doc(db, "jopLists", jobId));

    }

    // search jop from api
    const searchJop = async ( query: JopSearchType ) => {
        try {
            const params ={
                query: query.name,
                skills: Array.isArray (query.skill) ? query.skill.join(",") : query.skill,
                location: query.location,
                date_posted: query.date_posted ?? "anytime",
                country: query.country,
                page: "1",
                num_pages: "1",
            }


            const options = {
                method: 'GET',
                url: process.env.NEXT_PUBLIC_API_URL ?? '',
                params: params,
                headers: {
                  'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
                    'X-RapidAPI-Host': process.env.NEXT_PUBLIC_API_HOST!,
                },
            };
            const response = await axios.get(options.url, { params: options.params, headers: options.headers });
            
            response.data.data.forEach(async (job: JSearchJob) => {
                await addJop(job);
            });

            
        } catch (error) {
            
        }
    }

    return (
        <JopContext.Provider value={{ jopLists, addJop, updateJop, deleteJop, searchJop }}>
            {children}
        </JopContext.Provider>
    );
}

export function useJopContext() {
    const context = useContext(JopContext);

    if(!context) {
        throw new Error("useJopContext must be used within a JopProvider");
    }
    return context;
}