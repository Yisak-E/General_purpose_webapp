import React, { useState, useEffect, useMemo } from "react";
import Header from "../headers/Header.jsx";
import relaxImg from "../../assets/relax.png";
import hardworkingImg from "../../assets/hardwork.png";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  CheckCircle,
  Circle,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  Filter,
  Search,
  Plus,
  AlertCircle
} from "lucide-react";

// configs
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Priority options
const PRIORITY_OPTIONS = {
  low: { label: "Low", color: "bg-green-100 text-green-800 border-green-300" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  high: { label: "High", color: "bg-red-100 text-red-800 border-red-300" }
};

export default function TodoAndDone() {
  const db = getFirestore(app);
  const [toDOList, setTodoList] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    description: "",
    completed: false,
    priority: "medium",
    dueDate: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch data from Firebase in real-time
  useEffect(() => {
    setLoading(true);

    const todosQuery = query(
      collection(db, "todos"),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(todosQuery, (snapshot) => {
      const todos = [];
      snapshot.forEach((doc) => {
        todos.push({ id: doc.id, ...doc.data() });
      });

      setTodoList(todos);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching todos: ", error);
      setMessage("Error loading tasks");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return toDOList.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority;

      if (activeTab === "completed") return matchesSearch && matchesPriority && task.completed;
      if (activeTab === "todo") return matchesSearch && matchesPriority && !task.completed;

      return matchesSearch && matchesPriority;
    });
  }, [toDOList, searchTerm, filterPriority, activeTab]);

  const accomplishedTasks = useMemo(() => {
    return filteredTasks.filter(task => task.completed);
  }, [filteredTasks]);

  const todoTasks = useMemo(() => {
    return filteredTasks.filter(task => !task.completed);
  }, [filteredTasks]);

  const stats = useMemo(() => {
    const total = toDOList.length;
    const completed = toDOList.filter(task => task.completed).length;
    const pending = total - completed;
    const highPriority = toDOList.filter(task => !task.completed && task.priority === "high").length;

    return { total, completed, pending, highPriority };
  }, [toDOList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        // Update existing task
        const taskRef = doc(db, "todos", editingTask.id);
        await updateDoc(taskRef, {
          date: formData.date,
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate,
        });
        setMessage("Task updated successfully!");
      } else {
        // Add new task
        await addDoc(collection(db, "todos"), {
          date: formData.date || new Date().toISOString().split('T')[0],
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate,
          completed: false,
          createdAt: new Date().toISOString(),
        });
        setMessage("Task added successfully!");
      }

      // Reset form
      setFormData({
        date: "",
        title: "",
        description: "",
        completed: false,
        priority: "medium",
        dueDate: "",
      });
      setEditingTask(null);
      setShowForm(false);

      setTimeout(() => setMessage(""), 3000);
    } catch (e) {
      console.error("Error saving document: ", e);
      setMessage("Error saving task");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEdit = (task) => {
    setFormData({
      date: task.date,
      title: task.title,
      description: task.description,
      priority: task.priority || "medium",
      dueDate: task.dueDate || "",
      completed: task.completed,
    });
    setEditingTask(task);
    setShowForm(true);
  };

  const handleMarking = async (id, currentStatus) => {
    try {
      const taskRef = doc(db, "todos", id);
      await updateDoc(taskRef, {
        completed: !currentStatus,
        completedAt: !currentStatus ? new Date().toISOString() : null,
      });

      setMessage(`Task marked as ${!currentStatus ? 'completed' : 'todo'}!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating document: ", error);
      setMessage("Error updating task");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteDoc(doc(db, "todos", id));
        setMessage("Task deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error("Error deleting document: ", error);
        setMessage("Error deleting task");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const cancelEdit = () => {
    setFormData({
      date: "",
      title: "",
      description: "",
      completed: false,
      priority: "medium",
      dueDate: "",
    });
    setEditingTask(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !formData.completed;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-600">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ">
      <Header headerProps={{
        title: 'Advanced Todo',
        navLinks: [
          { label: 'Home', path: '/' },
          { label: 'Schedules', path: '/schedule' },
          { label: 'Job Search', path: '/jobSearch' }
        ]
      }} />
g
      {/* Stats Overview */}
      <div className="container mx-auto px-4 py-6 mt-21">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Tasks</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
            <div className="text-sm text-gray-500">High Priority</div>
          </div>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-xl shadow-sm border ${
            message.includes("Error") 
              ? "bg-red-50 border-red-200 text-red-800" 
              : "bg-green-50 border-green-200 text-green-800"
          }`}>
            <div className="flex items-center">
              {message.includes("Error") ? <AlertCircle className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
              {message}
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Task
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mt-4">
            {["all", "todo", "completed"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium capitalize ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} {tab === "all" ? `(${filteredTasks.length})` : tab === "todo" ? `(${todoTasks.length})` : `(${accomplishedTasks.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Task Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              {editingTask ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingTask ? "Edit Task" : "Create New Task"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Date</label>
                  <input
                    type="date"
                    name="date"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Todo Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Circle className="w-6 h-6 text-amber-500" />
                Todo Tasks ({todoTasks.length})
              </h3>
            </div>

            <div className={`p-4 max-h-96 overflow-y-auto ${todoTasks.length === 0 ? 'min-h-48' : ''}`}>
              {todoTasks.length > 0 ? (
                todoTasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 p-4 rounded-xl mb-3 border border-gray-200 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${PRIORITY_OPTIONS[task.priority]?.color}`}>
                          {PRIORITY_OPTIONS[task.priority]?.label}
                        </span>
                        {isOverdue(task.dueDate) && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
                            Overdue
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit task"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-semibold text-gray-800 mb-2">{task.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(task.date)}
                      </div>
                      {task.dueDate && (
                        <div className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : ''}`}>
                          <Clock className="w-3 h-3" />
                          Due: {formatDate(task.dueDate)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleMarking(task.id, task.completed)}
                      className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Complete
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <img src={relaxImg} alt="Relax" className="w-16 h-16 object-contain" />
                  </div>
                  <p className="text-gray-500">All tasks completed! Great job!</p>
                </div>
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Completed Tasks ({accomplishedTasks.length})
              </h3>
            </div>

            <div className={`p-4 max-h-96 overflow-y-auto ${accomplishedTasks.length === 0 ? 'min-h-48' : ''}`}>
              {accomplishedTasks.length > 0 ? (
                accomplishedTasks.map((task) => (
                  <div key={task.id} className="bg-green-50 p-4 rounded-xl mb-3 border border-green-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${PRIORITY_OPTIONS[task.priority]?.color}`}>
                        {PRIORITY_OPTIONS[task.priority]?.label}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit task"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-semibold text-gray-800 mb-2 line-through">{task.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-through">{task.description}</p>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(task.date)}
                      </div>
                      <div className="text-green-600 font-medium">
                        Completed
                      </div>
                    </div>

                    <button
                      onClick={() => handleMarking(task.id, task.completed)}
                      className="w-full mt-3 bg-amber-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors"
                    >
                      <Circle className="w-4 h-4" />
                      Mark as Todo
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-24 h-24 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                    <img src={hardworkingImg} alt="Hard work" className="w-16 h-16 object-contain" />
                  </div>
                  <p className="text-gray-500">No tasks completed yet! Keep going!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}