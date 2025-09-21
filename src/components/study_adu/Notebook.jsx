
import { db } from "../../api/firebaseConfigs";

import { useState, useEffect, useRef } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import Header from "../headers/Header.jsx";
import { useNavigate } from "react-router-dom";

export default function AdvancedNotebook() {
  const nav = useNavigate();
  const [notes, setNotes] = useState([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontColor, setFontColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showQuizPanel, setShowQuizPanel] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [quizType, setQuizType] = useState("mcq");

  const editorRef = useRef(null);
  const notesRef = collection(db, "advanced-notes");

  // Load notes
  useEffect(() => {
    setIsLoading(true);
    const q = query(notesRef, orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        }));
        setNotes(data);

        // If we have notes but no current note selected, select the first one
        if (data.length > 0 && currentNoteIndex === 0 && !currentNoteId) {
          setCurrentNoteIndex(0);
          setNoteContent(data[0].content || "");
          setNoteTitle(data[0].title || "");
          setCurrentNoteId(data[0].id);
          setFontSize(data[0].fontSize || 16);
          setFontWeight(data[0].fontWeight || "normal");
          setFontColor(data[0].fontColor || "#000000");
          setBackgroundColor(data[0].backgroundColor || "#ffffff");
        }

        setIsLoading(false);
      },
      (error) => {
        console.error("Error loading notes:", error);
        setMessage("Error loading notes");
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Save note
  const saveNote = async () => {
    if (!noteContent.trim() && !noteTitle.trim()) {
      setMessage("Note cannot be empty");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const noteData = {
        title: noteTitle,
        content: noteContent,
        fontSize,
        fontWeight,
        fontColor,
        backgroundColor,
        updatedAt: serverTimestamp(),
      };

      if (currentNoteId) {
        // Update existing note
        const noteDoc = doc(notesRef, currentNoteId);
        await updateDoc(noteDoc, noteData);
        setMessage("Note updated successfully");
      } else {
        // Create new note
        noteData.createdAt = serverTimestamp();
        const docRef = await addDoc(notesRef, noteData);
        setCurrentNoteId(docRef.id);
        setMessage("Note created successfully");
      }

      setTimeout(() => setMessage(""), 3000);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving note:", error);
      setMessage("Error saving note");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Create new note
  const createNewNote = () => {
    setNoteContent("");
    setNoteTitle("");
    setCurrentNoteId(null);
    setFontSize(16);
    setFontWeight("normal");
    setFontColor("#000000");
    setBackgroundColor("#ffffff");
    setIsEditing(true);
    setCurrentNoteIndex(-1); // -1 indicates a new note
  };

  // Select note
  const selectNote = (index) => {
    if (index >= 0 && index < notes.length) {
      const note = notes[index];
      setCurrentNoteIndex(index);
      setNoteContent(note.content || "");
      setNoteTitle(note.title || "");
      setCurrentNoteId(note.id);
      setFontSize(note.fontSize || 16);
      setFontWeight(note.fontWeight || "normal");
      setFontColor(note.fontColor || "#000000");
      setBackgroundColor(note.backgroundColor || "#ffffff");
      setIsEditing(false);
    }
  };

  // Delete current note
  const deleteNote = async () => {
    if (!currentNoteId) return;

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const noteDoc = doc(notesRef, currentNoteId);
      await deleteDoc(noteDoc);

      // Select the next note or previous if at the end
      if (notes.length > 1) {
        const newIndex = currentNoteIndex >= notes.length - 1 ? currentNoteIndex - 1 : currentNoteIndex;
        selectNote(newIndex);
      } else {
        // No notes left
        setNoteContent("");
        setNoteTitle("");
        setCurrentNoteId(null);
        setCurrentNoteIndex(-1);
      }

      setMessage("Note deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting note:", error);
      setMessage("Error deleting note");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Navigate to next/previous note
  const navigateNote = (direction) => {
    if (notes.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentNoteIndex + 1) % notes.length;
    } else {
      newIndex = (currentNoteIndex - 1 + notes.length) % notes.length;
    }

    selectNote(newIndex);
  };

  // Format text
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  // Generate quiz from note content
  const generateQuiz = () => {
    if (!noteContent.trim()) {
      setMessage("No content to generate quiz from");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Simple quiz generation logic - in a real app, you'd use more advanced NLP
    const sentences = noteContent.split(/[.!?]/).filter(s => s.trim().length > 10);

    if (sentences.length < 3) {
      setMessage("Not enough content to generate a quiz");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const generatedQuiz = {
      title: `Quiz for: ${noteTitle || "Untitled Note"}`,
      questions: [],
      type: quizType,
      createdAt: new Date().toISOString()
    };

    // Generate different question types based on quizType
    if (quizType === "mcq") {
      // Generate MCQ questions
      for (let i = 0; i < Math.min(5, sentences.length); i++) {
        const words = sentences[i].trim().split(/\s+/);
        if (words.length > 5) {
          const keyWord = words[Math.floor(words.length / 2)];
          generatedQuiz.questions.push({
            question: sentences[i].trim().replace(keyWord, "______"),
            options: [keyWord, "Option 1", "Option 2", "Option 3"].sort(() => Math.random() - 0.5),
            answer: keyWord
          });
        }
      }
    } else if (quizType === "fill") {
      // Generate fill in the blank questions
      for (let i = 0; i < Math.min(5, sentences.length); i++) {
        const words = sentences[i].trim().split(/\s+/);
        if (words.length > 5) {
          const keyWord = words[Math.floor(words.length / 2)];
          generatedQuiz.questions.push({
            question: sentences[i].trim().replace(keyWord, "______"),
            answer: keyWord
          });
        }
      }
    } else if (quizType === "drag") {
      // Generate drag and drop questions (simplified representation)
      for (let i = 0; i < Math.min(3, sentences.length); i++) {
        const words = sentences[i].trim().split(/\s+/).filter(w => w.length > 4);
        if (words.length >= 3) {
          generatedQuiz.questions.push({
            question: `Arrange these words in the correct order: ${words.slice(0, 3).join(", ")}`,
            items: words.slice(0, 3).sort(() => Math.random() - 0.5),
            correctOrder: words.slice(0, 3)
          });
        }
      }
    }

    setQuizData(generatedQuiz);
    setShowQuizPanel(true);
    setMessage("Quiz generated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  // Save quiz
  const saveQuiz = async () => {
    if (!quizData) return;

    try {
      const quizzesRef = collection(db, "quizzes");
      await addDoc(quizzesRef, {
        ...quizData,
        noteId: currentNoteId,
        noteTitle: noteTitle,
        createdAt: serverTimestamp()
      });

      setMessage("Quiz saved successfully!");
      setTimeout(() => setMessage(""), 3000);
      setShowQuizPanel(false);
    } catch (error) {
      console.error("Error saving quiz:", error);
      setMessage("Error saving quiz");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Filtered notes for search
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header headerProps={{
        title: 'Advanced Notebook',
        navLinks: [
          { label: 'Home', path: '/' },
          { label: 'Todo', path: '/TodoAndDone' },
          { label: 'Moody', path: '/moody' }
        ]
      }} />

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          {message && (
            <div className={`p-3 mb-6 rounded-lg text-center ${
              message.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}>
              {message}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Notes List */}
            <div className="w-full lg:w-64 bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Your Notes</h2>
                <button
                  onClick={createNewNote}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                  title="Create new note"
                >
                  +
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="w-full p-2 border rounded"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredNotes.map((note, index) => (
                  <div
                    key={note.id}
                    className={`p-3 rounded cursor-pointer ${
                      currentNoteIndex === index ? "bg-blue-100 border-blue-300" : "hover:bg-gray-100"
                    } border`}
                    onClick={() => selectNote(index)}
                  >
                    <div className="font-semibold truncate">{note.title || "Untitled Note"}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {note.content.replace(/<[^>]*>/g, "").substring(0, 50)}...
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {note.updatedAt ? note.updatedAt.toLocaleDateString() : ""}
                    </div>
                  </div>
                ))}

                {filteredNotes.length === 0 && !isLoading && (
                  <div className="text-center text-gray-500 py-4">
                    {searchQuery ? "No notes match your search" : "No notes yet"}
                  </div>
                )}
              </div>

              <button
                onClick={() => nav('/')}
                className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                ← Back to Home
              </button>
            </div>

            {/* Main Editor */}
            <div className="flex-1 bg-white rounded-lg shadow p-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigateNote('prev')}
                        disabled={notes.length <= 1}
                        className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Previous note"
                      >
                        ◀
                      </button>
                      <span className="text-sm text-gray-500">
                        {currentNoteIndex + 1} / {notes.length}
                      </span>
                      <button
                        onClick={() => navigateNote('next')}
                        disabled={notes.length <= 1}
                        className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Next note"
                      >
                        ▶
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowQuizPanel(!showQuizPanel)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                      >
                        {showQuizPanel ? "Hide Quiz" : "Generate Quiz"}
                      </button>
                      <button
                        onClick={deleteNote}
                        disabled={!currentNoteId}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                      <button
                        onClick={isEditing ? saveNote : () => setIsEditing(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        {isEditing ? "Save" : "Edit"}
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full p-2 border-b mb-4 text-xl font-bold"
                      placeholder="Note title"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                    />
                  ) : (
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">
                      {noteTitle || "Untitled Note"}
                    </h2>
                  )}

                  {/* Formatting Toolbar */}
                  {isEditing && (
                    <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-100 rounded">
                      <select
                        value={fontSize}
                        onChange={(e) => {
                          setFontSize(Number(e.target.value));
                          formatText('fontSize', e.target.value);
                        }}
                        className="p-1 border rounded"
                      >
                        <option value="12">12px</option>
                        <option value="14">14px</option>
                        <option value="16">16px</option>
                        <option value="18">18px</option>
                        <option value="20">20px</option>
                        <option value="24">24px</option>
                        <option value="28">28px</option>
                        <option value="32">32px</option>
                      </select>

                      <select
                        value={fontWeight}
                        onChange={(e) => {
                          setFontWeight(e.target.value);
                          formatText(e.target.value === 'bold' ? 'bold' : 'removeFormat');
                        }}
                        className="p-1 border rounded"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                      </select>

                      <input
                        type="color"
                        value={fontColor}
                        onChange={(e) => {
                          setFontColor(e.target.value);
                          formatText('foreColor', e.target.value);
                        }}
                        className="w-8 h-8"
                        title="Text color"
                      />

                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => {
                          setBackgroundColor(e.target.value);
                          formatText('hiliteColor', e.target.value);
                        }}
                        className="w-8 h-8"
                        title="Background color"
                      />

                      <button onClick={() => formatText('bold')} className="p-1 font-bold">B</button>
                      <button onClick={() => formatText('italic')} className="p-1 italic">I</button>
                      <button onClick={() => formatText('underline')} className="p-1 underline">U</button>
                      <button onClick={() => formatText('insertUnorderedList')} className="p-1">• List</button>
                    </div>
                  )}

                  {/* Editor/Viewer */}
                  <div
                    style={{
                      backgroundColor,
                      color: fontColor,
                      fontSize: `${fontSize}px`,
                      fontWeight,
                      minHeight: '400px'
                    }}
                    className="p-4 border rounded"
                  >
                    {isEditing ? (
                      <div
                        ref={editorRef}
                        contentEditable
                        dangerouslySetInnerHTML={{ __html: noteContent }}
                        onInput={(e) => setNoteContent(e.target.innerHTML)}
                        className="outline-none min-h-96"
                        style={{
                          backgroundColor,
                          color: fontColor,
                          fontSize: `${fontSize}px`,
                          fontWeight
                        }}
                      />
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{ __html: noteContent }}
                        className="min-h-96"
                      />
                    )}
                  </div>

                  {/* Quiz Panel */}
                  {showQuizPanel && (
                    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Quiz Generator</h3>
                        <select
                          value={quizType}
                          onChange={(e) => setQuizType(e.target.value)}
                          className="p-2 border rounded"
                        >
                          <option value="mcq">Multiple Choice</option>
                          <option value="fill">Fill in the Blank</option>
                          <option value="drag">Drag and Drop</option>
                        </select>
                      </div>

                      {quizData ? (
                        <div>
                          <h4 className="font-medium mb-2">{quizData.title}</h4>

                          {quizData.questions.length > 0 ? (
                            <div className="space-y-4">
                              {quizData.questions.map((q, i) => (
                                <div key={i} className="p-3 bg-white rounded border">
                                  <p className="font-medium">Q{i+1}: {q.question}</p>

                                  {quizData.type === "mcq" && (
                                    <ul className="mt-2 space-y-1">
                                      {q.options.map((opt, j) => (
                                        <li key={j} className="flex items-center">
                                          <input type="radio" name={`q${i}`} id={`q${i}_opt${j}`} className="mr-2" />
                                          <label htmlFor={`q${i}_opt${j}`}>{opt}</label>
                                        </li>
                                      ))}
                                    </ul>
                                  )}

                                  {quizData.type === "fill" && (
                                    <input type="text" className="mt-2 p-1 border rounded" />
                                  )}

                                  {quizData.type === "drag" && (
                                    <div className="mt-2">
                                      <p className="text-sm text-gray-600">Drag items to correct order:</p>
                                      <div className="flex gap-2 mt-1">
                                        {q.items.map((item, j) => (
                                          <div key={j} className="px-2 py-1 bg-blue-100 rounded cursor-move">
                                            {item}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}

                              <div className="flex justify-end space-x-2 mt-4">
                                <button
                                  onClick={() => setQuizData(null)}
                                  className="px-4 py-2 border border-gray-300 rounded"
                                >
                                  Regenerate
                                </button>
                                <button
                                  onClick={saveQuiz}
                                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                  Save Quiz
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-500">Could not generate questions from this content.</p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 mb-4">
                            Generate a {quizType === "mcq" ? "multiple choice" : quizType === "fill" ? "fill in the blank" : "drag and drop"} quiz from your note content.
                          </p>
                          <button
                            onClick={generateQuiz}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Generate Quiz
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}