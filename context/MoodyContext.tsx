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
  useRef,
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
  const editorRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("postedAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      setPosts(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Moodpost, "id">),
        }))
      );
    });
  }, []);

  
  const addPost = async (
    message: string,
    mood: Moodpost["feeling"]
  ) => {
    if (!message.trim()) return;

    await addDoc(collection(db, "posts"), {
      message,
      mood,
      postedAt: serverTimestamp(),
    });
  };


  const updatePost = async (
    id: string,
    message: string,
    mood: Moodpost["feeling"]
  ) => {
    if (!id) return;

    await updateDoc(doc(db, "posts", id), {
      message,
      mood,
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
