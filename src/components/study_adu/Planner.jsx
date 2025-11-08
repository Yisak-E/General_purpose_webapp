import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocs
} from "firebase/firestore";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import Header from "../headers/Header.jsx";
import { db } from "../../api/firebaseConfigs.js";
import {AnalyticsDashboard} from "./AnalyticsComponents.jsx";

// Sortable Row Component
// Sortable Row Component
const SortableRow = ({ row, onEdit, onDelete, isExpanded, onToggleExpand, onUpdateNotes }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getProbabilityColor = (probability) => {
    switch (probability) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCoverageColor = (coverage) => {
    const coverageValue = coverage || 0;
    if (coverageValue >= 80) return "bg-green-100 text-green-800";
    if (coverageValue >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <tr
        ref={setNodeRef}
        style={style}
        className={`hover:bg-gray-50 ${isDragging ? 'shadow-lg' : ''}`}
      >
        <td className="border border-gray-300 p-2">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            >
              ⋮⋮
            </button>
            <span className="font-mono text-sm">{row.page || 'N/A'}</span>
          </div>
        </td>
        <td className="border border-gray-300 p-2">{row.topicSummary || 'N/A'}</td>
        <td className="border border-gray-300 p-2">{row.likelyQuestionTypes || 'N/A'}</td>
        <td className="border border-gray-300 p-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(row.examProbability)}`}>
            {row.examProbability || 'Medium'}
          </span>
        </td>
        <td className="border border-gray-300 p-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(row.studyStatus)}`}>
            {row.studyStatus || 'Not Started'}
          </span>
        </td>
        <td className="border border-gray-300 p-2">
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${row.coverage || 0}%` }}
              ></div>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getCoverageColor(row.coverage)}`}>
              {row.coverage || 0}%
            </span>
          </div>
        </td>
        <td className="border border-gray-300 p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => onToggleExpand(row.id)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {isExpanded ? '▲ Notes' : '▼ Notes'}
            </button>
            <button
              onClick={() => onEdit(row)}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(row.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-blue-50">
          <td colSpan="7" className="border border-gray-300 p-4">
            <div>
              <h4 className="font-semibold mb-2">Study Notes</h4>
              <textarea
                className="w-full p-2 border rounded h-[300px] bg-[#479f67] font-semibold italic"
                placeholder="Add your study notes here..."
                value={row.notes || ''}
                onChange={(e) => {
                  onUpdateNotes(row.id, e.target.value);
                }}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">
                  Auto-saves to Firebase
                </span>
                <button
                  onClick={() => onToggleExpand(row.id)}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Close Notes
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default function Planner() {
  const nav = useNavigate();
  const [data, setData] = useState({ courses: [] });
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [activeId, setActiveId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Keyboard shortcuts
  useHotkeys('ctrl+n, cmd+n', () => {
    handleAddNewRow();
  }, { preventDefault: true });

  useHotkeys('ctrl+s, cmd+s', () => {
    if (isEditing && currentRow) {
      handleSaveRow();
    }
  }, { preventDefault: true });

  useHotkeys('ctrl+f, cmd+f', (e) => {
    e.preventDefault();
    document.querySelector('input[placeholder*="Search"]')?.focus();
  });

  useHotkeys('escape', () => {
    if (isEditing) {
      setIsEditing(false);
      setCurrentRow(null);
    }
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

// Add this function to validate and clean data
const validateAndCleanData = (data) => {
  const courses = data.courses || [];

  courses.forEach(course => {
    course.chapters?.forEach(chapter => {
      // Remove duplicate pages by ID
      const uniquePages = chapter.pages?.reduce((acc, page) => {
        if (!acc.find(p => p.id === page.id)) {
          acc.push(page);
        }
        return acc;
      }, []) || [];

      chapter.pages = uniquePages;
    });
  });

  return { courses };
};

// Use it in your Firebase snapshot
useEffect(() => {
  setIsLoading(true);
  const q = query(collection(db, "study-planner"), orderBy("priority", "asc"));
  const unsubscribe = onSnapshot(q,
    (snapshot) => {
      const firebaseData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));

      const nestedData = convertToNestedStructure(firebaseData);
      const cleanedData = validateAndCleanData(nestedData);
      setData(cleanedData);

      // Set initial selections if not set
      if (cleanedData.courses.length > 0 && !selectedCourse) {
        setSelectedCourse(cleanedData.courses[0].id);
        if (cleanedData.courses[0].chapters.length > 0) {
          setSelectedChapter(cleanedData.courses[0].chapters[0].id);
        }
      }

      setIsLoading(false);
    },
    (error) => {
      console.error("Error loading data:", error);
      setMessage("Error loading study data");
      setIsLoading(false);
    }
  );
  return () => unsubscribe();
}, []);

  // Conversion function
 // Improved conversion function with better error handling
const convertToNestedStructure = (firebaseData) => {
  const coursesMap = {};

  firebaseData.forEach(item => {
    try {
      // Skip invalid or duplicate items
      if (!item.id) {
        console.warn('Skipping item without ID:', item);
        return;
      }

      const courseId = item.courseId || 'default-course';
      const chapterId = item.chapterId || 'default-chapter';

      if (!coursesMap[courseId]) {
        coursesMap[courseId] = {
          id: courseId,
          name: item.courseName || 'Unnamed Course',
          color: item.courseColor || '#3B82F6',
          chapters: {}
        };
      }

      if (!coursesMap[courseId].chapters[chapterId]) {
        coursesMap[courseId].chapters[chapterId] = {
          id: chapterId,
          name: item.chapterName || 'Unnamed Chapter',
          priority: item.chapterPriority || 1,
          pages: []
        };
      }

      // Check for duplicate pages before adding
      const existingPageIndex = coursesMap[courseId].chapters[chapterId].pages.findIndex(
        p => p.id === item.id
      );

      if (existingPageIndex === -1) {
        // Add new page
        const pageData = {
          id: item.id,
          page: item.page || '',
          topicSummary: item.topicSummary || '',
          likelyQuestionTypes: item.likelyQuestionTypes || '',
          examProbability: item.examProbability || 'Medium',
          coverage: item.coverage || 0,
          notes: item.notes || '',
          studyStatus: item.studyStatus || 'Not Started',
          priority: item.priority || 999,
          courseId: courseId,
          courseName: item.courseName || 'Unnamed Course',
          chapterId: chapterId,
          chapterName: item.chapterName || 'Unnamed Chapter',
          chapterPriority: item.chapterPriority || 1,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        };

        coursesMap[courseId].chapters[chapterId].pages.push(pageData);
      } else {
        // Update existing page (avoid duplicates)
        console.log('Duplicate page found, updating:', item.id);
        coursesMap[courseId].chapters[chapterId].pages[existingPageIndex] = {
          ...coursesMap[courseId].chapters[chapterId].pages[existingPageIndex],
          ...item
        };
      }
    } catch (error) {
      console.error("Error processing item:", item, error);
    }
  });

  // Sort pages by priority and remove any potential duplicates
  Object.values(coursesMap).forEach(course => {
    Object.values(course.chapters).forEach(chapter => {
      // Remove duplicates by ID
      const uniquePages = chapter.pages.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      chapter.pages = uniquePages.sort((a, b) => (a.priority || 999) - (b.priority || 999));
    });
  });

  return {
    courses: Object.values(coursesMap).map(course => ({
      ...course,
      chapters: Object.values(course.chapters).sort((a, b) => (a.priority || 1) - (b.priority || 1))
    }))
  };
};

  const getCurrentCourse = () => {
    return data.courses.find(course => course.id === selectedCourse);
  };

  const getCurrentChapter = () => {
    const course = getCurrentCourse();
    return course?.chapters.find(chapter => chapter.id === selectedChapter);
  };

const getCurrentPages = () => {
  const chapter = getCurrentChapter();
  const pages = chapter?.pages || [];

  // Remove duplicates and sort
  const uniquePages = pages.reduce((acc, current) => {
    const existing = acc.find(item => item.id === current.id);
    if (!existing) {
      return [...acc, current];
    }
    return acc;
  }, []);

  return uniquePages
    .sort((a, b) => (a.priority || 999) - (b.priority || 999))
    .map(page => ({
      id: page.id,
      page: page.page || '',
      topicSummary: page.topicSummary || '',
      likelyQuestionTypes: page.likelyQuestionTypes || '',
      examProbability: page.examProbability || 'Medium',
      coverage: page.coverage || 0,
      notes: page.notes || '',
      studyStatus: page.studyStatus || 'Not Started',
      priority: page.priority || 999,
      courseId: page.courseId,
      courseName: page.courseName,
      chapterId: page.chapterId,
      chapterName: page.chapterName,
      chapterPriority: page.chapterPriority
    }));
};

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
  const { active, over } = event;
  setActiveId(null);

  if (!over || active.id === over.id) return;

  const pages = getCurrentPages();
  const oldIndex = pages.findIndex((page) => page.id === active.id);
  const newIndex = pages.findIndex((page) => page.id === over.id);

  if (oldIndex === -1 || newIndex === -1) return;

  // Update local state immediately for better UX
  const updatedPages = arrayMove(pages, oldIndex, newIndex);

  // Update priorities in Firebase for real documents only
  const updatePromises = updatedPages
    .filter(page => !page.id.startsWith('temp-')) // Only update real Firebase docs
    .map((page, index) =>
      updateDoc(doc(db, "study-planner", page.id), {
        priority: index + 1,
        updatedAt: serverTimestamp()
      })
    );

  try {
    await Promise.all(updatePromises);
    setMessage('Priority updated!');
    setTimeout(() => setMessage(''), 2000);
  } catch (error) {
    console.error("Error updating priorities:", error);
    setMessage('Error updating priorities');
    setTimeout(() => setMessage(''), 3000);
  }
};

  const handleAddNewRow = () => {
  const currentCourse = getCurrentCourse();
  const currentChapter = getCurrentChapter();

  if (!currentCourse || !currentChapter) {
    setMessage("Please select a course and chapter first");
    setTimeout(() => setMessage(''), 3000);
    return;
  }

  setCurrentRow({
    id: `temp-${Date.now()}`,
    page: '',
    topicSummary: '',
    likelyQuestionTypes: '',
    examProbability: 'Medium',
    coverage: 0,
    notes: '',
    studyStatus: 'Not Started',
    priority: getCurrentPages().length + 1,
    // Include course and chapter info for consistency
    courseId: selectedCourse,
    courseName: currentCourse.name,
    chapterId: selectedChapter,
    chapterName: currentChapter.name,
    chapterPriority: currentChapter.priority || 1,
    // Timestamps for local state
    createdAt: new Date(),
    updatedAt: new Date()
  });
  setIsEditing(true);
};

const handleEditRow = (row) => {
  // Create a clean copy of the row to avoid reference issues
  const rowToEdit = {
    id: row.id,
    page: row.page || '',
    topicSummary: row.topicSummary || '',
    likelyQuestionTypes: row.likelyQuestionTypes || '',
    examProbability: row.examProbability || 'Medium',
    coverage: row.coverage || 0,
    notes: row.notes || '',
    studyStatus: row.studyStatus || 'Not Started',
    priority: row.priority || 999,
    courseId: row.courseId,
    courseName: row.courseName,
    chapterId: row.chapterId,
    chapterName: row.chapterName,
    chapterPriority: row.chapterPriority
  };

  setCurrentRow(rowToEdit);
  setIsEditing(true);

  // Close any expanded notes when editing
  setExpandedRows(prev => {
    const newSet = new Set(prev);
    newSet.delete(row.id);
    return newSet;
  });
};

const handleDeleteRow = async (pageId) => {
  if (!window.confirm("Are you sure you want to delete this page?")) return;

  // If it's a temporary row, just remove from local state
  if (pageId.startsWith('temp-')) {
    setMessage('Temporary page removed');
    setTimeout(() => setMessage(''), 3000);
    return;
  }

  try {
    // First check if document exists before trying to delete
    const docRef = doc(db, "study-planner", pageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
      setMessage('Page deleted successfully');
    } else {
      setMessage('Page not found in database');
    }
    setTimeout(() => setMessage(''), 3000);
  } catch (error) {
    console.error("Error deleting from Firebase:", error);
    setMessage('Error deleting page: ' + error.message);
    setTimeout(() => setMessage(''), 3000);
  }
};

const handleSaveRow = async () => {
  if (!currentRow.page?.trim() || !currentRow.topicSummary?.trim()) {
    setMessage("Page and Topic Summary are required");
    setTimeout(() => setMessage(""), 3000);
    return;
  }

  const currentCourse = getCurrentCourse();
  const currentChapter = getCurrentChapter();

  if (!currentCourse || !currentChapter) {
    setMessage("Please select a course and chapter");
    setTimeout(() => setMessage(""), 3000);
    return;
  }

  try {
    const isTemporary = currentRow.id.startsWith('temp-');

    const firebaseData = {
      page: currentRow.page.trim(),
      topicSummary: currentRow.topicSummary.trim(),
      likelyQuestionTypes: currentRow.likelyQuestionTypes?.trim() || '',
      examProbability: currentRow.examProbability || 'Medium',
      coverage: currentRow.coverage || 0,
      notes: currentRow.notes || '',
      studyStatus: currentRow.studyStatus || 'Not Started',
      courseId: selectedCourse,
      courseName: currentCourse.name,
      chapterId: selectedChapter,
      chapterName: currentChapter.name,
      chapterPriority: currentChapter.priority || 1,
      priority: currentRow.priority || getCurrentPages().length + 1,
      updatedAt: serverTimestamp(),
    };

    let savedDocId = currentRow.id;

    if (isTemporary) {
      // Create new document for temporary rows
      firebaseData.createdAt = serverTimestamp();
      const docRef = await addDoc(collection(db, "study-planner"), firebaseData);
      savedDocId = docRef.id; // Use the actual Firebase ID
      setMessage('Page added successfully');
    } else {
      // Update existing document using setDoc with merge
      await setDoc(doc(db, "study-planner", currentRow.id), firebaseData, { merge: true });
      setMessage('Page updated successfully');
    }

    setTimeout(() => setMessage(""), 3000);
    setIsEditing(false);
    setCurrentRow(null);

    // Clear any expanded state for the edited row
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(currentRow.id);
      return newSet;
    });

  } catch (error) {
    console.error("Error saving to Firebase:", error);
    setMessage("Error saving data: " + error.message);
    setTimeout(() => setMessage(""), 3000);
  }
};

const handleUpdateNotes = async (pageId, newNotes) => {
  // Don't try to save notes for temporary rows
  if (pageId.startsWith('temp-')) {
    return;
  }

  try {
    await setDoc(doc(db, "study-planner", pageId), {
      notes: newNotes,
      updatedAt: serverTimestamp()
    }, { merge: true });
    // Notes are auto-saved, no need for message
  } catch (error) {
    console.error("Error updating notes:", error);
    // Don't show error message for notes to avoid spam
  }
};

  const toggleRowExpand = (rowId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  // Export functions
  const exportToCSV = () => {
    const pages = getCurrentPages();
    if (pages.length === 0) {
      setMessage("No data to export");
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const headers = ['Page', 'Topic Summary', 'Likely Question Types', 'Exam Probability', 'Study Status', 'Coverage %', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...pages.map(page => [
        `"${page.page || ''}"`,
        `"${page.topicSummary || ''}"`,
        `"${page.likelyQuestionTypes || ''}"`,
        `"${page.examProbability || ''}"`,
        `"${page.studyStatus || ''}"`,
        page.coverage || 0,
        `"${page.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const courseName = getCurrentCourse()?.name || 'study';
    const chapterName = getCurrentChapter()?.name || 'plan';
    a.download = `${courseName}_${chapterName}_study_plan.csv`.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.click();
    URL.revokeObjectURL(url);

    setMessage('CSV exported successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const exportToPDF = async () => {
    const element = document.getElementById('study-table');
    if (!element) {
      setMessage("No table found to export");
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const courseName = getCurrentCourse()?.name || 'study';
      pdf.save(`${courseName}_study_plan.pdf`.replace(/[^a-z0-9]/gi, '_').toLowerCase());

      setMessage('PDF exported successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      setMessage('Error exporting PDF');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const exportToExcel = () => {
    const pages = getCurrentPages();
    if (pages.length === 0) {
      setMessage("No data to export");
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(pages.map(page => ({
        Page: page.page || '',
        'Topic Summary': page.topicSummary || '',
        'Likely Question Types': page.likelyQuestionTypes || '',
        'Exam Probability': page.examProbability || '',
        'Study Status': page.studyStatus || '',
        'Coverage %': page.coverage || 0,
        'Notes': page.notes || '',
        'Priority': page.priority || 0
      })));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Study Plan');
      const courseName = getCurrentCourse()?.name || 'study';
      XLSX.writeFile(workbook, `${courseName}_study_plan.xlsx`.replace(/[^a-z0-9]/gi, '_').toLowerCase());

      setMessage('Excel file exported successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      setMessage('Error exporting Excel');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const importFromJSON = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        await uploadToFirebase(importedData);
        setMessage('Data imported successfully and uploaded to Firebase!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error("Error importing data:", error);
        setMessage('Error importing data. Please check the file format.');
        setTimeout(() => setMessage(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  const uploadToFirebase = async (importedData) => {
    try {
      // First, clear existing Firebase data
      const existingDocs = await getDocs(collection(db, "study-planner"));
      const deletePromises = existingDocs.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Then upload new data
      const uploadPromises = [];

      importedData.courses?.forEach(course => {
        course.chapters?.forEach(chapter => {
          chapter.pages?.forEach(page => {
            const firebaseDoc = {
              ...page,
              courseId: course.id,
              courseName: course.name,
              chapterId: chapter.id,
              chapterName: chapter.name,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };

            uploadPromises.push(addDoc(collection(db, "study-planner"), firebaseDoc));
          });
        });
      });

      await Promise.all(uploadPromises);
      console.log('Successfully uploaded to Firebase');

    } catch (error) {
      console.error('Firebase upload failed:', error);
      throw new Error('Firebase upload failed');
    }
  };

  const calculateChapterStats = () => {
    const chapter = getCurrentChapter();
    if (!chapter) return { totalPages: 0, averageCoverage: 0, completed: 0 };

    const pages = chapter.pages || [];
    const totalPages = pages.length;
    const totalCoverage = pages.reduce((sum, page) => sum + (page.coverage || 0), 0);
    const averageCoverage = totalPages > 0 ? Math.round(totalCoverage / totalPages) : 0;
    const completed = pages.filter(page => page.coverage >= 100).length;

    return { totalPages, averageCoverage, completed };
  };

const filteredPages = getCurrentPages().filter(page => {
  if (!page) return false;

  const searchLower = searchQuery.toLowerCase();
  return (
    (page.page || '').toLowerCase().includes(searchLower) ||
    (page.topicSummary || '').toLowerCase().includes(searchLower) ||
    (page.likelyQuestionTypes || '').toLowerCase().includes(searchLower) ||
    (page.notes || '').toLowerCase().includes(searchLower)
  );
});

  const chapterStats = calculateChapterStats();
  const currentCourse = getCurrentCourse();
  const currentChapter = getCurrentChapter();

  return (
    <>
      <Header headerProps={{
        title: 'Study Planner Pro',
        navLinks: [
          { label: 'Home', path: '/' },
          { label: 'Todo', path: '/TodoAndDone' },
          { label: 'Moody', path: '/moody' },
          { label: 'Notebook', path: '/AdvancedNotebook' }
        ]
      }} />

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 mt-12">
          {message && (
            <div className={`p-3 mb-6 rounded-lg text-center ${
              message.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}>
              {message}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            {/* Header Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Study Planner Pro</h1>
                <p className="text-gray-600">Organize your courses, chapters, and study progress</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="table">Table View</option>
                  <option value="charts">Charts</option>
                  <option value="analytics">Analytics</option>
                </select>

                <button
                  onClick={handleAddNewRow}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add New Page
                </button>
              </div>
            </div>

            {/* Course and Chapter Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    const course = data.courses.find(c => c.id === e.target.value);
                    if (course && course.chapters.length > 0) {
                      setSelectedChapter(course.chapters[0].id);
                    }
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a course</option>
                  {data.courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a chapter</option>
                  {currentCourse?.chapters.map(chapter => (
                    <option key={chapter.id} value={chapter.id}>{chapter.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chapter Stats */}
            {currentChapter && (
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{chapterStats.totalPages}</div>
                  <div className="text-sm text-blue-800">Total Pages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{chapterStats.averageCoverage}%</div>
                  <div className="text-sm text-green-800">Avg Coverage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{chapterStats.completed}</div>
                  <div className="text-sm text-purple-800">Completed</div>
                </div>
              </div>
            )}

            {/* Search and Export Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search pages, topics, question types, or notes..."
                  className="w-full p-3 border rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Export CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Export PDF
                </button>
                <button
                  onClick={exportToExcel}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Export Excel
                </button>
                <label className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 cursor-pointer">
                  Import JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={importFromJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Keyboard Shortcuts Help */}
            <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
              <span className="font-semibold">Keyboard Shortcuts:</span>
              <span className="ml-4">Ctrl+N: Add New</span>
              <span className="ml-4">Ctrl+S: Save</span>
              <span className="ml-4">Ctrl+F: Search</span>
              <span className="ml-4">Esc: Cancel</span>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : viewMode === "table" ? (
              <>
                {/* Edit Form */}
                {isEditing && currentRow && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                   <h3 className="text-lg font-semibold mb-4">
                      {currentRow.id && !currentRow.id.startsWith('temp-') ? "Edit Page" : "Add New Page"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Page *</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          placeholder="e.g., Ch6-Page1"
                          value={currentRow.page}
                          onChange={(e) => setCurrentRow({...currentRow, page: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic Summary *</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          placeholder="Topic description"
                          value={currentRow.topicSummary}
                          onChange={(e) => setCurrentRow({...currentRow, topicSummary: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Types</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          placeholder="e.g., Definition, Scenario"
                          value={currentRow.likelyQuestionTypes}
                          onChange={(e) => setCurrentRow({...currentRow, likelyQuestionTypes: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Probability</label>
                        <select
                          value={currentRow.examProbability}
                          onChange={(e) => setCurrentRow({...currentRow, examProbability: e.target.value})}
                          className="w-full p-2 border rounded"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Study Status</label>
                        <select
                          value={currentRow.studyStatus}
                          onChange={(e) => setCurrentRow({...currentRow, studyStatus: e.target.value})}
                          className="w-full p-2 border rounded"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Coverage: {currentRow.coverage}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={currentRow.coverage}
                          onChange={(e) => setCurrentRow({...currentRow, coverage: Number(e.target.value)})}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Study Notes</label>
                      <textarea
                        className="w-full p-2 border rounded min-h-24"
                        placeholder="Add study notes..."
                        value={currentRow.notes}
                        onChange={(e) => setCurrentRow({...currentRow, notes: e.target.value})}
                      />
                    </div>
                    <button
                      onClick={handleSaveRow}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                     {currentRow.id && !currentRow.id.startsWith('temp-') ? "Update Page" : "Add Page"}
                    </button>
                  </div>
                )}
                {/* Table */}
                <div className="overflow-x-auto" id="study-table">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-3 text-left font-semibold w-40">Page</th>
                          <th className="border border-gray-300 p-3 text-left font-semibold">Topic Summary</th>
                          <th className="border border-gray-300 p-3 text-left font-semibold w-40">Question Types</th>
                          <th className="border border-gray-300 p-3 text-left font-semibold w-32">Probability</th>
                          <th className="border border-gray-300 p-3 text-left font-semibold w-32">Status</th>
                          <th className="border border-gray-300 p-3 text-left font-semibold w-40">Coverage</th>
                          <th className="border border-gray-300 p-3 text-left font-semibold w-48">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <SortableContext items={filteredPages.map(p => p.id)} strategy={verticalListSortingStrategy}>
                          {filteredPages.map((row) => (
                            <SortableRow
                              key={row.id}
                              row={row}
                              onEdit={handleEditRow}
                              onDelete={handleDeleteRow}
                              isExpanded={expandedRows.has(row.id)}
                              onToggleExpand={toggleRowExpand}
                              onUpdateNotes={handleUpdateNotes}
                            />
                          ))}
                        </SortableContext>
                      </tbody>
                    </table>
                    <DragOverlay>
                      {activeId ? (
                        <div className="bg-white p-4 border rounded shadow-lg opacity-80">
                          {filteredPages.find(p => p.id === activeId)?.page}
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>

                  {filteredPages.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {currentChapter ? "No pages found" : "Please select a course and chapter"}
                      {searchQuery && currentChapter && " - Try adjusting your search."}
                    </div>
                  )}
                </div>
              </>
            ) : viewMode === "charts" ? (
              <AnalyticsDashboard
                data={data}
                selectedCourse={selectedCourse}
                selectedChapter={selectedChapter}
                getCurrentPages={getCurrentPages}
                getCurrentChapter={getCurrentChapter}
                getCurrentCourse={getCurrentCourse}
              />
            ) : viewMode === "analytics" ? (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow border">
                  <h3 className="text-xl font-semibold mb-4">Advanced Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{chapterStats.totalPages}</div>
                      <div className="text-sm text-blue-800">Total Pages</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{chapterStats.averageCoverage}%</div>
                      <div className="text-sm text-green-800">Average Coverage</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{chapterStats.completed}</div>
                      <div className="text-sm text-purple-800">Completed Pages</div>
                    </div>
                  </div>

                  {/* Additional Analytics Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {filteredPages.filter(p => p.examProbability === 'High').length}
                      </div>
                      <div className="text-sm text-red-800">High Priority</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {filteredPages.filter(p => p.examProbability === 'Medium').length}
                      </div>
                      <div className="text-sm text-yellow-800">Medium Priority</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {filteredPages.filter(p => p.studyStatus === 'In Progress').length}
                      </div>
                      <div className="text-sm text-orange-800">In Progress</div>
                    </div>
                  </div>

                  {/* Progress Breakdown */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold mb-3">Progress Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Not Started</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gray-400 h-2 rounded-full"
                              style={{ width: `${(filteredPages.filter(p => p.studyStatus === 'Not Started').length / filteredPages.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">
                            {filteredPages.filter(p => p.studyStatus === 'Not Started').length}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">In Progress</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(filteredPages.filter(p => p.studyStatus === 'In Progress').length / filteredPages.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">
                            {filteredPages.filter(p => p.studyStatus === 'In Progress').length}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completed</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(filteredPages.filter(p => p.studyStatus === 'Completed').length / filteredPages.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">
                            {filteredPages.filter(p => p.studyStatus === 'Completed').length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Study Recommendations */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-blue-800">Study Recommendations</h4>
                    <div className="space-y-2">
                      {filteredPages.filter(p => p.examProbability === 'High' && p.coverage < 50).length > 0 && (
                        <p className="text-sm text-blue-700">
                          ⚠️ Focus on {filteredPages.filter(p => p.examProbability === 'High' && p.coverage < 50).length} high-priority pages with low coverage
                        </p>
                      )}
                      {filteredPages.filter(p => p.studyStatus === 'Not Started' && p.examProbability === 'High').length > 0 && (
                        <p className="text-sm text-blue-700">
                          🎯 Start studying {filteredPages.filter(p => p.studyStatus === 'Not Started' && p.examProbability === 'High').length} high-priority pages
                        </p>
                      )}
                      {chapterStats.averageCoverage > 70 && (
                        <p className="text-sm text-green-700">
                          ✅ Great progress! You're {chapterStats.averageCoverage}% through this chapter
                        </p>
                      )}
                      {filteredPages.filter(p => p.coverage >= 80).length === filteredPages.length && (
                        <p className="text-sm text-green-700">
                          🎉 Excellent! All pages have good coverage
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-center py-8">
                    <p className="text-gray-600">Advanced predictive analytics and insights coming soon...</p>
                    <p className="text-sm text-gray-500 mt-2">Study patterns, performance trends, and personalized recommendations</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}