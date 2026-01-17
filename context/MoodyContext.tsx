"use client";

import { db } from "@/api/firebaseConfigs";
import { Moodpost } from "@/type";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


interface MoodyContextType {
  posts: Moodpost[];
  addPost: (message: string, mood: Moodpost["feeling"]) => Promise<void>;
  updatePost: (id: string, message: string, mood: Moodpost["feeling"]) => Promise<void>;
}


const MoodyContext = createContext<MoodyContextType | null>(null);


export function MoodyProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Moodpost[]>([]);


  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("postedAt", "desc")
    );

    return onSnapshot(q, (snap) => {
    setPosts(
      snap.docs.map((d) => {
        const data = d.data();

        return {
          id: d.id,
          feeling: data.feeling,
          message: data.message,
          postedAt: data.postedAt?.toDate() ?? new Date(),   // 🔥 convert Timestamp → Date
        } satisfies Moodpost;
      })
    );
  });
  }, []);

  
  const addPost = async (
    message: string,
    feeling: string
  ) => {
    if (!message.trim()) return;

    await addDoc(collection(db, "posts"), {
      message,
      feeling,
      postedAt: serverTimestamp(),
    });
  };


  const updatePost = async (
    id: string,
    message: string,
    feeling: string
  ) => {
    if (!id) return;

    await updateDoc(doc(db, "posts", id), {
      message,
      feeling,
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <MoodyContext.Provider
      value={{
        posts,
        addPost,
        updatePost,
      }}
    >
      {children}
    </MoodyContext.Provider>
  );
}


export function useMoody() {
  const context = useContext(MoodyContext);
  if (!context) {
    throw new Error("useMoody must be used within a MoodyProvider");
  }
  return context;
}
