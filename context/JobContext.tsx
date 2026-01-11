'use client';

import { db } from "@/api/firebaseConfigs";
import axios from "axios";
import { JobSearchType, JSearchJob } from "@/type/jobSearchType";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  serverTimestamp,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface jobContextType {
  jobLists: JSearchJob[];
  loading: boolean;
  error: string | null;
  addjob: (newjob: JSearchJob) => Promise<void>;
  updatejob: (updatedjob: JSearchJob) => Promise<void>;
  deletejob: (jobId: string) => Promise<void>;
  searchjob: (query: JobSearchType) => Promise<void>;
}

const jobContext = createContext<jobContextType | null>(null);

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobLists, setjobLists] = useState<JSearchJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* 🔥 REAL-TIME FIRESTORE LISTENER */
  useEffect(() => {
    const q = query(
      collection(db, "jopLists"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      setjobLists(
        snap.docs.map((d) => d.data() as JSearchJob)
      );
    });
  }, []);

  /* ➕ ADD JOB */
  const addjob = async (newjob: JSearchJob) => {
    await setDoc(doc(db, "jopLists", newjob.job_id), {
      ...newjob,
      createdAt: serverTimestamp(),
    });
  };

  /* ✏️ UPDATE JOB */
  const updatejob = async (updatedjob: JSearchJob) => {
    await updateDoc(doc(db, "jopLists", updatedjob.job_id), {
      ...updatedjob,
      updatedAt: serverTimestamp(),
    });
  };

  /* ❌ DELETE JOB */
  const deletejob = async (jobId: string) => {
    await deleteDoc(doc(db, "jopLists", jobId));
  };

  /* 🔍 SEARCH JOB FROM API */
  const searchjob = async (searchQuery: JobSearchType) => {
    if (!searchQuery.name?.trim()) {
      throw new Error("Job title is required");
    }

    setLoading(true);
    setError(null);

    try {
      /* ✅ APIs expect ONE human-readable query string */
      const queryString = [
        searchQuery.name,
        searchQuery.skill,
        searchQuery.location,
      ]
        .filter(Boolean)
        .join(" ");

      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL!,
        {
          params: {
            query: queryString,
            country: searchQuery.country || "US",
            page: 1,
            num_pages: 1,
          },
          headers: {
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
            "X-RapidAPI-Host": process.env.NEXT_PUBLIC_API_HOST!,
          },
        }
      );

      if (!Array.isArray(response.data?.data)) {
        throw new Error("Invalid API response");
      }

      /* 🚀 BATCH WRITE (FAST + SAFE) */
      const batch = writeBatch(db);

      response.data.data.forEach((job: JSearchJob) => {
        batch.set(
          doc(db, "jobLists", job.job_id),
          {
            ...job,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setError("Job search failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <jobContext.Provider
      value={{
        jobLists,
        loading,
        error,
        addjob,
        updatejob,
        deletejob,
        searchjob,
      }}
    >
      {children}
    </jobContext.Provider>
  );
}

export function usejobContext() {
  const context = useContext(jobContext);
  if (!context) {
    throw new Error("usejobContext must be used inside jobProvider");
  }
  return context;
}
