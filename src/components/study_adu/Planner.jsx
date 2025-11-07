import { db } from "../../api/firebaseConfigs";
import { useState, useEffect } from "react";
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

export default function Planner() {
  const nav = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table"); // table, chart, stats

  // Form state for new/edit row
  const [formData, setFormData] = useState({
    page: "",
    topicSummary: "",
    likelyQuestionTypes: "",
    examProbability: "Medium",
    coverage: 0
  });

  const subjectsRef = collection(db, "study-planner");

  // Sample data structure
  const sampleData = [
    { page: "Ch6-Page1", topicSummary: "Intro to work & wealth in information age", likelyQuestionTypes: "Definition, Scenario", examProbability: "High", coverage: 0 },
    { page: "Ch6-Page2", topicSummary: "Industrial vs Information revolutions", likelyQuestionTypes: "Comparison", examProbability: "High", coverage: 0 },
    { page: "Ch6-Page3", topicSummary: "Rise of information workers", likelyQuestionTypes: "Definition, Listing", examProbability: "Medium", coverage: 0 },
    // ... Add all your sample data here
  ];

  // Load subjects
  useEffect(() => {
    setIsLoading(true);
    const q = query(subjectsRef, orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        }));
        setSubjects(data);
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

  // Save row
  const saveRow = async () => {
    if (!formData.page.trim() || !formData.topicSummary.trim()) {
      setMessage("Page and Topic Summary are required");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const rowData = {
        ...formData,
        subject: currentSubject,
        updatedAt: serverTimestamp(),
      };

      if (currentRowId) {
        // Update existing row
        const rowDoc = doc(subjectsRef, currentRowId);
        await updateDoc(rowDoc, rowData);
        setMessage("Row updated successfully");
      } else {
        // Create new row
        rowData.createdAt = serverTimestamp();
        await addDoc(subjectsRef, rowData);
        setMessage("New row added successfully");
      }

      setTimeout(() => setMessage(""), 3000);
      resetForm();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving data:", error);
      setMessage("Error saving data");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      page: "",
      topicSummary: "",
      likelyQuestionTypes: "",
      examProbability: "Medium",
      coverage: 0
    });
    setCurrentRowId(null);
  };

  // Edit row
  const editRow = (row) => {
    setFormData({
      page: row.page,
      topicSummary: row.topicSummary,
      likelyQuestionTypes: row.likelyQuestionTypes,
      examProbability: row.examProbability,
      coverage: row.coverage
    });
    setCurrentRowId(row.id);
    setCurrentSubject(row.subject || "");
    setIsEditing(true);
  };

  // Delete row
  const deleteRow = async (id) => {
    if (!window.confirm("Are you sure you want to delete this row?")) return;

    try {
      const rowDoc = doc(subjectsRef, id);
      await deleteDoc(rowDoc);
      setMessage("Row deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting row:", error);
      setMessage("Error deleting row");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalRows = subjects.length;
    const totalCoverage = subjects.reduce((sum, row) => sum + (row.coverage || 0), 0);
    const averageCoverage = totalRows > 0 ? totalCoverage / totalRows : 0;
    const highProbabilityRows = subjects.filter(row => row.examProbability === "High").length;
    const mediumProbabilityRows = subjects.filter(row => row.examProbability === "Medium").length;
    const lowProbabilityRows = subjects.filter(row => row.examProbability === "Low").length;

    return {
      totalRows,
      averageCoverage: Math.round(averageCoverage),
      highProbabilityRows,
      mediumProbabilityRows,
      lowProbabilityRows,
      completionRate: Math.round((subjects.filter(s => (s.coverage || 0) >= 80).length / totalRows) * 100) || 0
    };
  };

  // Filtered subjects for search
  const filteredSubjects = subjects.filter(subject =>
    subject.page.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.topicSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.likelyQuestionTypes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = calculateStats();

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

  return (
    <>
      <Header headerProps={{
        title: 'Study Planner',
        navLinks: [
          { label: 'Home', path: '/' },
          { label: 'Todo', path: '/TodoAndDone' },
          { label: 'Moody', path: '/moody' },
          { label: 'Notebook', path: '/AdvancedNotebook' }
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

          <div className="bg-white rounded-lg shadow p-6">
            {/* Header Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Study Planner</h1>
                <p className="text-gray-600">Track your study progress and exam preparation</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="table">Table View</option>
                  <option value="chart">Chart View</option>
                  <option value="stats">Statistics</option>
                </select>

                <button
                  onClick={() => {
                    resetForm();
                    setIsEditing(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add New Row
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search pages, topics, or question types..."
                className="w-full p-3 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : viewMode === "table" ? (
              <>
                {/* Edit Form */}
                {isEditing && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">
                      {currentRowId ? "Edit Row" : "Add New Row"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Page *</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          placeholder="e.g., Ch6-Page1"
                          value={formData.page}
                          onChange={(e) => setFormData({...formData, page: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic Summary *</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          placeholder="Topic description"
                          value={formData.topicSummary}
                          onChange={(e) => setFormData({...formData, topicSummary: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Types</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          placeholder="e.g., Definition, Scenario"
                          value={formData.likelyQuestionTypes}
                          onChange={(e) => setFormData({...formData, likelyQuestionTypes: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Probability</label>
                        <select
                          value={formData.examProbability}
                          onChange={(e) => setFormData({...formData, examProbability: e.target.value})}
                          className="w-full p-2 border rounded"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Coverage: {formData.coverage}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.coverage}
                          onChange={(e) => setFormData({...formData, coverage: Number(e.target.value)})}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          resetForm();
                        }}
                        className="px-4 py-2 border border-gray-300 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveRow}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        {currentRowId ? "Update" : "Save"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Page</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Topic Summary</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Likely Question Types</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Exam Probability</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Coverage</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubjects.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3 font-mono text-sm">{row.page}</td>
                          <td className="border border-gray-300 p-3">{row.topicSummary}</td>
                          <td className="border border-gray-300 p-3">{row.likelyQuestionTypes}</td>
                          <td className="border border-gray-300 p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(row.examProbability)}`}>
                              {row.examProbability}
                            </span>
                          </td>
                          <td className="border border-gray-300 p-3">
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
                          <td className="border border-gray-300 p-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => editRow(row)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteRow(row.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredSubjects.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No study data found. {searchQuery && "Try adjusting your search."}
                    </div>
                  )}
                </div>
              </>
            ) : viewMode === "stats" ? (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Study Statistics</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalRows}</div>
                    <div className="text-sm text-blue-800">Total Pages</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.averageCoverage}%</div>
                    <div className="text-sm text-green-800">Avg Coverage</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.highProbabilityRows}</div>
                    <div className="text-sm text-red-800">High Probability</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
                    <div className="text-sm text-purple-800">Completion Rate</div>
                  </div>
                </div>

                {/* Probability Distribution */}
                <div>
                  <h4 className="font-medium mb-3">Probability Distribution</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-red-100 rounded">
                      <div className="text-lg font-bold">{stats.highProbabilityRows}</div>
                      <div className="text-sm">High</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-100 rounded">
                      <div className="text-lg font-bold">{stats.mediumProbabilityRows}</div>
                      <div className="text-sm">Medium</div>
                    </div>
                    <div className="text-center p-3 bg-green-100 rounded">
                      <div className="text-lg font-bold">{stats.lowProbabilityRows}</div>
                      <div className="text-sm">Low</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Chart view coming soon...
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}