import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
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
  getDocs  // ← Add this import
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
import {db} from "../../api/firebaseConfigs.js";

// Sample data structure
const sampleData = {

  courses: [
    {
      id: 'course-1',
      name: 'Computer Ethics',
      color: '#3B82F6',
      chapters: [
        {
          id: 'chapter-1',
          name: 'Chapter 6: Work and Wealth',
          priority: 1,
          pages: [
            { id: 'page-1', page: 'Ch6-Page1', topicSummary: 'Intro to work & wealth in information age', likelyQuestionTypes: 'Definition, Scenario', examProbability: 'High', coverage: 0, notes: '', studyStatus: 'Not Started', priority: 1 },
            { id: 'page-2', page: 'Ch6-Page2', topicSummary: 'Industrial vs Information revolutions', likelyQuestionTypes: 'Comparison', examProbability: 'High', coverage: 0, notes: '', studyStatus: 'Not Started', priority: 2 },
            { id: 'page-3', page: 'Ch6-Page3', topicSummary: 'Rise of information workers', likelyQuestionTypes: 'Definition, Listing', examProbability: 'Medium', coverage: 0, notes: '', studyStatus: 'Not Started', priority: 3 },
          ]
        },
        {
          id: 'chapter-2',
          name: 'Chapter 7: Cybersecurity',
          priority: 2,
          pages: [
            { id: 'page-4', page: 'Ch7-Page1-2', topicSummary: 'Overview: hacking, malware, cybercrime, online voting', likelyQuestionTypes: 'Listing, Definition', examProbability: 'High', coverage: 0, notes: '', studyStatus: 'Not Started', priority: 1 },
            { id: 'page-5', page: 'Ch7-Page3', topicSummary: 'Meaning and history of hacker', likelyQuestionTypes: 'Definition, Comparison', examProbability: 'High', coverage: 0, notes: '', studyStatus: 'Not Started', priority: 2 },
          ]
        }
      ]
    },
    {
      id: 'course-2',
      name: 'Data Structures',
      color: '#10B981',
      chapters: [
        {
          id: 'chapter-3',
          name: 'Chapter 1: Arrays',
          priority: 1,
          pages: [
            { id: 'page-6', page: 'Ch1-Page1', topicSummary: 'Introduction to Arrays', likelyQuestionTypes: 'Definition, MCQ', examProbability: 'High', coverage: 0, notes: '', studyStatus: 'Not Started', priority: 1 },
          ]
        }
      ]
    }
  ]
};

// Sortable Row Component
const SortableRow = ({ row, onEdit, onDelete, isExpanded, onToggleExpand }) => {
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
    if (coverage >= 80) return "bg-green-100 text-green-800";
    if (coverage >= 50) return "bg-yellow-100 text-yellow-800";
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
            <span className="font-mono text-sm">{row.page}</span>
          </div>
        </td>
        <td className="border border-gray-300 p-2">{row.topicSummary}</td>
        <td className="border border-gray-300 p-2">{row.likelyQuestionTypes}</td>
        <td className="border border-gray-300 p-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(row.examProbability)}`}>
            {row.examProbability}
          </span>
        </td>
        <td className="border border-gray-300 p-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(row.studyStatus)}`}>
            {row.studyStatus}
          </span>
        </td>
        <td className="border border-gray-300 p-2">
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${row.coverage}%` }}
              ></div>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getCoverageColor(row.coverage)}`}>
              {row.coverage}%
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
                className="w-full p-2 border rounded min-h-24"
                placeholder="Add your study notes here..."
                value={row.notes}
                onChange={(e) => {
                  // This would be connected to an update function
                  console.log('Update notes:', row.id, e.target.value);
                }}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">
                  Last updated: {new Date().toLocaleDateString()}
                </span>
                <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                  Save Notes
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
  const [data, setData] = useState(sampleData);
const [selectedCourse, setSelectedCourse] = useState(sampleData.courses[0].id);
const [selectedChapter, setSelectedChapter] = useState(sampleData.courses[0].chapters[0].id);
const [isEditing, setIsEditing] = useState(false);
const [currentRow, setCurrentRow] = useState(null);
const [searchQuery, setSearchQuery] = useState("");
const [message, setMessage] = useState("");
const [viewMode, setViewMode] = useState("table");
const [expandedRows, setExpandedRows] = useState(new Set());
const [activeId, setActiveId] = useState(null);
const [isLoading, setIsLoading] = useState(true); // Add loading state back

// Replace the entire useEffect with proper Firebase sync:
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

      // Convert Firebase flat structure back to nested course/chapter structure
      const nestedData = convertToNestedStructure(firebaseData);
      setData(nestedData);
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

// Add this conversion function:
const convertToNestedStructure = (firebaseData) => {
  const coursesMap = {};

  firebaseData.forEach(item => {
    if (!coursesMap[item.courseId]) {
      coursesMap[item.courseId] = {
        id: item.courseId,
        name: item.courseName,
        color: item.courseColor || '#3B82F6',
        chapters: {}
      };
    }

    if (!coursesMap[item.courseId].chapters[item.chapterId]) {
      coursesMap[item.courseId].chapters[item.chapterId] = {
        id: item.chapterId,
        name: item.chapterName,
        priority: item.chapterPriority || 1,
        pages: []
      };
    }

    coursesMap[item.courseId].chapters[item.chapterId].pages.push(item);
  });

  return {
    courses: Object.values(coursesMap).map(course => ({
      ...course,
      chapters: Object.values(course.chapters)
    }))
  };
};

  // Keyboard shortcuts
  useHotkeys('ctrl+n, cmd+n', () => {
    handleAddNewRow();
  }, { preventDefault: true });

  useHotkeys('ctrl+s, cmd+s', () => {
    if (isEditing) {
      // Save logic here
      setMessage('Saved! (Ctrl+S)');
      setTimeout(() => setMessage(''), 2000);
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

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('study-planner-data');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('study-planner-data', JSON.stringify(data));
  }, [data]);

  const getCurrentCourse = () => {
    return data.courses.find(course => course.id === selectedCourse);
  };

  const getCurrentChapter = () => {
    const course = getCurrentCourse();
    return course?.chapters.find(chapter => chapter.id === selectedChapter);
  };

  const getCurrentPages = () => {
    const chapter = getCurrentChapter();
    return chapter?.pages || [];
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

 const handleDragEnd = async (event) => {
  const { active, over } = event;
  setActiveId(null);

  if (active.id !== over?.id) {
    const pages = getCurrentPages();
    const oldIndex = pages.findIndex((page) => page.id === active.id);
    const newIndex = pages.findIndex((page) => page.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedPages = arrayMove(pages, oldIndex, newIndex);

      // Update priorities in Firebase
      const updatePromises = updatedPages.map((page, index) =>
        updateDoc(doc(db, "study-planner", page.id), {
          priority: index + 1,
          updatedAt: serverTimestamp()
        })
      );

      await Promise.all(updatePromises);
      setMessage('Priority updated!');
      setTimeout(() => setMessage(''), 2000);
    }
  }
};

  const handleAddNewRow = () => {
    setCurrentRow({
      id: `page-${Date.now()}`,
      page: '',
      topicSummary: '',
      likelyQuestionTypes: '',
      examProbability: 'Medium',
      coverage: 0,
      notes: '',
      studyStatus: 'Not Started',
      priority: getCurrentPages().length + 1
    });
    setIsEditing(true);
  };

  const handleEditRow = (row) => {
    setCurrentRow({ ...row });
    setIsEditing(true);
  };

  const handleDeleteRow = async (pageId) => {
  if (!window.confirm("Are you sure you want to delete this page?")) return;

  try {
    await deleteDoc(doc(db, "study-planner", pageId));
    setMessage('Page deleted successfully');
    setTimeout(() => setMessage(''), 3000);
  } catch (error) {
    console.error("Error deleting from Firebase:", error);
    setMessage('Error deleting page');
    setTimeout(() => setMessage(''), 3000);
  }
};

 const handleSaveRow = async () => {
  if (!currentRow.page.trim() || !currentRow.topicSummary.trim()) {
    setMessage("Page and Topic Summary are required");
    setTimeout(() => setMessage(""), 3000);
    return;
  }

  try {
    const firebaseData = {
      ...currentRow,
      courseId: selectedCourse,
      courseName: getCurrentCourse()?.name,
      chapterId: selectedChapter,
      chapterName: getCurrentChapter()?.name,
      chapterPriority: getCurrentChapter()?.priority,
      updatedAt: serverTimestamp(),
    };

    if (currentRow.id && !currentRow.id.startsWith('page-')) {
      // Update existing in Firebase
      const rowDoc = doc(db, "study-planner", currentRow.id);
      await updateDoc(rowDoc, firebaseData);
      setMessage('Page updated successfully');
    } else {
      // Create new in Firebase
      firebaseData.createdAt = serverTimestamp();
      firebaseData.priority = getCurrentPages().length + 1;
      await addDoc(collection(db, "study-planner"), firebaseData);
      setMessage('Page added successfully');
    }

    setTimeout(() => setMessage(""), 3000);
    setIsEditing(false);
    setCurrentRow(null);
  } catch (error) {
    console.error("Error saving to Firebase:", error);
    setMessage("Error saving data");
    setTimeout(() => setMessage(""), 3000);
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
    const headers = ['Page', 'Topic Summary', 'Likely Question Types', 'Exam Probability', 'Study Status', 'Coverage %', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...pages.map(page => [
        `"${page.page}"`,
        `"${page.topicSummary}"`,
        `"${page.likelyQuestionTypes}"`,
        `"${page.examProbability}"`,
        `"${page.studyStatus}"`,
        page.coverage,
        `"${page.notes}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getCurrentCourse()?.name}_${getCurrentChapter()?.name}_study_plan.csv`.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.click();
    URL.revokeObjectURL(url);

    setMessage('CSV exported successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const exportToPDF = async () => {
    const element = document.getElementById('study-table');
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${getCurrentCourse()?.name}_study_plan.pdf`.replace(/[^a-z0-9]/gi, '_').toLowerCase());

    setMessage('PDF exported successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const exportToExcel = () => {
    const pages = getCurrentPages();
    const worksheet = XLSX.utils.json_to_sheet(pages.map(page => ({
      Page: page.page,
      'Topic Summary': page.topicSummary,
      'Likely Question Types': page.likelyQuestionTypes,
      'Exam Probability': page.examProbability,
      'Study Status': page.studyStatus,
      'Coverage %': page.coverage,
      'Notes': page.notes,
      'Priority': page.priority
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Study Plan');
    XLSX.writeFile(workbook, `${getCurrentCourse()?.name}_study_plan.xlsx`.replace(/[^a-z0-9]/gi, '_').toLowerCase());

    setMessage('Excel file exported successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const importFromJSON = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const importedData = JSON.parse(e.target.result);

      // Save to localStorage (existing functionality)
      setData(importedData);

      // NEW: Upload to Firebase
      await uploadToFirebase(importedData);

      setMessage('Data imported successfully and uploaded to Firebase!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error importing data. Please check the file format.');
      setTimeout(() => setMessage(''), 3000);
    }
  };
  reader.readAsText(file);
};

// NEW: Add this Firebase upload function
const uploadToFirebase = async (importedData) => {
  try {
    // First, clear existing Firebase data
    const existingDocs = await getDocs(collection(db, "study-planner"));
    const deletePromises = existingDocs.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Then upload new data
    const uploadPromises = [];

    importedData.courses.forEach(course => {
      course.chapters.forEach(chapter => {
        chapter.pages.forEach(page => {
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

  const filteredPages = getCurrentPages().filter(page =>
    page.page.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.topicSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.likelyQuestionTypes.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  {currentCourse?.chapters.map(chapter => (
                    <option key={chapter.id} value={chapter.id}>{chapter.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chapter Stats */}
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
                      {currentRow.id.startsWith('page-') ? "Add New Page" : "Edit Page"}
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
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setCurrentRow(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveRow}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        {currentRow.id.startsWith('page-') ? "Add Page" : "Update Page"}
                      </button>
                    </div>
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
                        {filteredPages.map((row, index) => (
                          <SortableRow
                            key={row.id}
                            row={row}
                            onEdit={handleEditRow}
                            onDelete={handleDeleteRow}
                            isExpanded={expandedRows.has(row.id)}
                            onToggleExpand={toggleRowExpand}
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
                      No pages found. {searchQuery && "Try adjusting your search."}
                    </div>
                  )}
                </div>
              </>
            ) : viewMode === "charts" ? (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Study Analytics</h3>

                {/* Chapter Coverage Chart */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-4">Chapter Coverage Progress</h4>
                  <div className="space-y-3">
                    {currentCourse?.chapters.map(chapter => {
                      const chapterPages = chapter.pages || [];
                      const totalCoverage = chapterPages.reduce((sum, page) => sum + (page.coverage || 0), 0);
                      const avgCoverage = chapterPages.length > 0 ? Math.round(totalCoverage / chapterPages.length) : 0;

                      return (
                        <div key={chapter.id} className="flex items-center">
                          <span className="w-48 text-sm truncate">{chapter.name}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-4 mx-4">
                            <div
                              className="bg-blue-600 h-4 rounded-full"
                              style={{ width: `${avgCoverage}%` }}
                            ></div>
                          </div>
                          <span className="w-12 text-sm font-medium">{avgCoverage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Probability Distribution */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-4">Exam Probability Distribution</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-red-100 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {filteredPages.filter(p => p.examProbability === 'High').length}
                      </div>
                      <div className="text-sm font-medium">High Priority</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-100 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {filteredPages.filter(p => p.examProbability === 'Medium').length}
                      </div>
                      <div className="text-sm font-medium">Medium Priority</div>
                    </div>
                    <div className="text-center p-4 bg-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {filteredPages.filter(p => p.examProbability === 'Low').length}
                      </div>
                      <div className="text-sm font-medium">Low Priority</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Advanced analytics view coming soon...
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}