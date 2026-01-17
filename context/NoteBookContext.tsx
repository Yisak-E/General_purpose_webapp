'use client';
import {createContext, useContext, useEffect, useState} from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from '../api/firebaseConfigs';
import { Note } from '@/type';
import { Quiz, QuizType } from "@/type";


interface NotebookContextType {
    notes: Note[];
    noteTitle: string;
    noteContent: string;
    quizType: QuizType;
    quizData: Quiz | null;
    setNoteTitle: (v: string) => void;
    setNoteContent: (v: string) => void;
    // generateQuiz: () => void;
}

const NotebookContext = createContext<NotebookContextType | null>(null);

export function NoteBookProvider({children}: {children: React.ReactNode}) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [noteTitle, setNoteTitle] = useState<string>('');
    const [noteContent, setNoteContent] = useState<string>('');
    const [quizType] = useState<QuizType>('mcq');
    const [quizData] = useState<Quiz | null>(null);
     
    useEffect(() => {
        const q = query(collection(db, "advanced-notes"), orderBy("updatedAt", "desc"));

        return onSnapshot(q, snap => {
            setNotes(
                snap.docs.map(
                    doc => ({
                        id: doc.id, 
                        ...(doc.data() as Omit<Note, "id">),
                    })
                )
            )
        })
    }, []);


     return (
        <NotebookContext.Provider
            value={{
                notes,
                noteTitle,
                noteContent,
                quizType,
                quizData,
                setNoteTitle,
                setNoteContent,
            
            }}
        >
        {children}
        </NotebookContext.Provider>
    );
}


export function useNoteBookContext() {
    const context = useContext(NotebookContext);
    if (!context) {
        throw new Error("useNoteBookContext must be used within a NoteBookProvider");
    }
    return context;
}