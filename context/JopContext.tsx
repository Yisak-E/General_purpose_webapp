'use client';

import { db } from "@/api/firebaseConfigs";
import axios from "axios";
import { JopSearchType, JSearchJob } from "@/type/jopSearchType";
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

interface JopContextType {
  jopLists: JSearchJob[];
  loading: boolean;
  error: string | null;
  addJop: (newJop: JSearchJob) => Promise<void>;
  updateJop: (updatedJop: JSearchJob) => Promise<void>;
  deleteJop: (jobId: string) => Promise<void>;
  searchJop: (query: JopSearchType) => Promise<void>;
}

const JopContext = createContext<JopContextType | null>(null);

export function JopProvider({ children }: { children: React.ReactNode }) {
  const [jopLists, setJopLists] = useState<JSearchJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* 🔥 REAL-TIME FIRESTORE LISTENER */
  useEffect(() => {
    const q = query(
      collection(db, "jopLists"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      setJopLists(
        snap.docs.map((d) => d.data() as JSearchJob)
      );
    });
  }, []);

  /* ➕ ADD JOB */
  const addJop = async (newJop: JSearchJob) => {
    await setDoc(doc(db, "jopLists", newJop.job_id), {
      ...newJop,
      createdAt: serverTimestamp(),
    });
  };

  /* ✏️ UPDATE JOB */
  const updateJop = async (updatedJop: JSearchJob) => {
    await updateDoc(doc(db, "jopLists", updatedJop.job_id), {
      ...updatedJop,
      updatedAt: serverTimestamp(),
    });
  };

  /* ❌ DELETE JOB */
  const deleteJop = async (jobId: string) => {
    await deleteDoc(doc(db, "jopLists", jobId));
  };

  /* 🔍 SEARCH JOB FROM API */
  const searchJop = async (searchQuery: JopSearchType) => {
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
          doc(db, "jopLists", job.job_id),
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
    <JopContext.Provider
      value={{
        jopLists,
        loading,
        error,
        addJop,
        updateJop,
        deleteJop,
        searchJop,
      }}
    >
      {children}
    </JopContext.Provider>
  );
}

export function useJopContext() {
  const context = useContext(JopContext);
  if (!context) {
    throw new Error("useJopContext must be used inside JopProvider");
  }
  return context;
}
