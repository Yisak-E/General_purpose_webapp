import {db} from '../api/firebaseConfigs.js'
import Header from "./headers/Header.jsx";
import {useState, useEffect} from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

// Study Calendar Component
function StudyCalendar({ selectedSemester, schedules }) {
    const [examDate, setExamDate] = useState("");
    const [daysUntilExam, setDaysUntilExam] = useState(null);
    const [totalClassDays, setTotalClassDays] = useState(0);
    const [classesCompleted, setClassesCompleted] = useState(0);

    // Calculate days until exam and class statistics
    useEffect(() => {
        // Calculate total unique class days
        const uniqueDays = new Set(schedules.map(schedule => schedule.day));
        setTotalClassDays(uniqueDays.size);

        // Calculate days until exam
        if (examDate) {
            const today = new Date();
            const exam = new Date(examDate);
            const timeDiff = exam.getTime() - today.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            setDaysUntilExam(daysDiff);
        }

        // Mock classes completed (you can replace this with actual data)
        setClassesCompleted(Math.floor(Math.random() * (schedules.length + 1)));
    }, [examDate, schedules]);

    const getProgressPercentage = () => {
        if (totalClassDays === 0) return 0;
        return Math.min(100, (classesCompleted / schedules.length) * 100);
    };

    const getExamUrgency = () => {
        if (!daysUntilExam) return 'normal';
        if (daysUntilExam <= 7) return 'urgent';
        if (daysUntilExam <= 14) return 'warning';
        return 'normal';
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📚 Study Calendar</h2>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold">
                    {selectedSemester}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Days Until Exam */}
                <div className={`p-4 rounded-xl text-white ${
                    getExamUrgency() === 'urgent' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                        : getExamUrgency() === 'warning'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}>
                    <div className="text-3xl font-bold mb-2">
                        {daysUntilExam !== null ? daysUntilExam : '--'}
                    </div>
                    <div className="text-sm opacity-90">
                        {daysUntilExam !== null ? (
                            daysUntilExam === 0 ? 'Exam is today! 🎯' :
                            daysUntilExam === 1 ? '1 day until exam' :
                            `${daysUntilExam} days until exam`
                        ) : 'Set exam date'}
                    </div>
                    {daysUntilExam !== null && daysUntilExam <= 7 && (
                        <div className="text-xs mt-2 bg-white/20 px-2 py-1 rounded-full">
                            ⚡ Time to study!
                        </div>
                    )}
                </div>

                {/* Total Class Days */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl text-white">
                    <div className="text-3xl font-bold mb-2">{totalClassDays}</div>
                    <div className="text-sm opacity-90">Class days per week</div>
                </div>

                {/* Classes Scheduled */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-xl text-white">
                    <div className="text-3xl font-bold mb-2">{schedules.length}</div>
                    <div className="text-sm opacity-90">Total classes</div>
                </div>

                {/* Progress */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-xl text-white">
                    <div className="text-3xl font-bold mb-2">
                        {Math.round(getProgressPercentage())}%
                    </div>
                    <div className="text-sm opacity-90">Completion progress</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Course Progress</span>
                    <span>{classesCompleted} of {schedules.length} classes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                </div>
            </div>

            {/* Exam Date Input */}
            <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-gray-700 font-semibold mb-3">
                    🎯 Set Final Exam Date
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <input
                        type="date"
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                    />
                    <button
                        onClick={() => {
                            if (examDate) {
                                localStorage.setItem(`${selectedSemester}_examDate`, examDate);
                            }
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                        Save Date
                    </button>
                </div>
                {examDate && (
                    <p className="text-sm text-gray-600 mt-2">
                        Exam scheduled for: {new Date(examDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                )}
            </div>

            {/* Study Tips */}
            {daysUntilExam !== null && daysUntilExam <= 30 && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">📖 Study Tips</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                        {daysUntilExam <= 7 && (
                            <>
                                <li>• Focus on key concepts and practice problems</li>
                                <li>• Review past exams and assignments</li>
                                <li>• Get plenty of rest before the exam</li>
                            </>
                        )}
                        {daysUntilExam > 7 && daysUntilExam <= 14 && (
                            <>
                                <li>• Create a study schedule for each topic</li>
                                <li>• Start with difficult subjects first</li>
                                <li>• Practice with timed exercises</li>
                            </>
                        )}
                        {daysUntilExam > 14 && daysUntilExam <= 30 && (
                            <>
                                <li>• Review course materials weekly</li>
                                <li>• Create summary notes for each chapter</li>
                                <li>• Form study groups with classmates</li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

// Updated ScheduleTable component with calendar integration
function ScheduleTable({schedule, selectedSemester, onDeleteSchedule}) {
    const [day, setDay] = useState("Monday");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleChange = (e) => {
        setDay(e.target.value);
    }

    // Filter schedules by selected day
    const filteredSchedules = schedule.filter(item => item.day === day);

    const handleDelete = async (scheduleId) => {
        let pass =   prompt("Enter the password: ")
        if(pass == "starhack"){
            await deleteDoc(scheduleId);

        }else{
            alert("Oh, I know you try to delete, but I commented the code 😊")
        }
    };

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    // Calculate daily stats
    const dailyStats = {
        totalClasses: filteredSchedules.length,
        totalHours: filteredSchedules.length * 1.5, // Assuming 1.5 hours per class
        earliestClass: filteredSchedules.length > 0 ?
            filteredSchedules.reduce((earliest, current) =>
                earliest.time < current.time ? earliest : current
            ).time : 'N/A'
    };

    return (
        <div className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Day Selection - Modern Tabs */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            📅 {selectedSemester} Schedule
                        </h3>
                        <p className="text-blue-100 text-sm mt-1">
                            {dailyStats.totalClasses} classes • {dailyStats.totalHours}h • Starts: {dailyStats.earliestClass}
                        </p>
                    </div>
                    <div className="flex space-x-1 bg-white/20 rounded-xl p-1">
                        {days.map((dayItem) => (
                            <button
                                key={dayItem}
                                onClick={() => setDay(dayItem)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                                    day === dayItem
                                        ? 'bg-white text-blue-600 shadow-lg'
                                        : 'text-white hover:bg-white/20'
                                }`}
                            >
                                {isMobile ? dayItem.slice(0, 3) : dayItem}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Schedule Content */}
            <div className="p-6">
                {filteredSchedules.length > 0 ? (
                    <div className="space-y-4">
                        {filteredSchedules.map((scheduleItem, index) => (
                            <div
                                key={scheduleItem.id || index}
                                className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                                    {/* Course Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-blue-500 text-white p-3 rounded-xl shadow-lg">
                                                <span className="text-lg font-bold">
                                                    {scheduleItem.course?.split(' ').map(word => word[0]).join('') || 'CO'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-xl font-bold text-gray-800">
                                                    {scheduleItem.course}
                                                </h4>
                                                <div className="flex flex-wrap gap-3 mt-2">
                                                    <div className="flex items-center space-x-2 text-gray-600">
                                                        <span className="bg-blue-100 p-1 rounded">🕒</span>
                                                        <span className="font-medium">{scheduleItem.time}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-gray-600">
                                                        <span className="bg-green-100 p-1 rounded">🏢</span>
                                                        <span className="font-medium">{scheduleItem.room}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-gray-600">
                                                        <span className="bg-purple-100 p-1 rounded">📅</span>
                                                        <span className="font-medium">{scheduleItem.day}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex space-x-3">
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(scheduleItem.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-2xl font-bold text-gray-600 mb-2">No classes scheduled</h3>
                        <p className="text-gray-500">No schedules found for {day}. Add some classes to get started!</p>
                    </div>
                )}
            </div>

            {/* Stats Bar */}
            {filteredSchedules.length > 0 && (
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                    <div className="flex flex-wrap justify-between items-center text-sm text-gray-600">
                        <span>📊 {filteredSchedules.length} classes on {day}</span>
                        <span>⏱️ Total study time: {dailyStats.totalHours}h</span>
                        <span>🎯 {Math.round((filteredSchedules.length / schedule.length) * 100)}% of weekly classes</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// AddScheduleForm component remains the same as before
function AddScheduleForm({selectedSemester, onAddSchedule}) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        course: '',
        day: 'Monday',
        time: '',
        room: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.course && formData.time && formData.room) {
            await onAddSchedule(selectedSemester, formData);
            setFormData({
                course: '',
                day: 'Monday',
                time: '',
                room: ''
            });
            setIsOpen(false);
        }
    };

    return (
        <div className="mt-6">
            <button
                onClick={() => setIsOpen(true)}
                className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-3"
            >
                <span className="text-xl">+</span>
                <span>Add New Schedule</span>
                <span className="group-hover:rotate-90 transition-transform duration-300">✨</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                            <h3 className="text-2xl font-bold text-white text-center">
                                Add New Schedule
                            </h3>
                            <p className="text-blue-100 text-center mt-1">
                                {selectedSemester}
                            </p>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    📚 Course Code
                                </label>
                                <input
                                    type="text"
                                    name="course"
                                    value={formData.course}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="e.g., SWE370 - Advanced Web Development"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    📅 Day
                                </label>
                                <select
                                    name="day"
                                    value={formData.day}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                >
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        🕒 Time
                                    </label>
                                    <input
                                        type="text"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        placeholder="e.g., 12:50 PM"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        🏢 Room
                                    </label>
                                    <input
                                        type="text"
                                        name="room"
                                        value={formData.room}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        placeholder="e.g., D-IF-8A"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    Add Schedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Main Schedules component
export default function Schedules() {
    const [schedules, setSchedules] = useState({
        Fall2025: [],
        Winter2026: [],
        Spring2026: [],
        Summer2026: [],
        Fall2026: [],
        Winter2027: [],
        Spring2027: [],
    });

    const [selectedSemester, setSelectedSemester] = useState("Fall2025");

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "schedule"),
            (snapshot) => {
                const schedulesData = {
                    Fall2025: [],
                    Winter2026: [],
                    Spring2026: [],
                    Summer2026: [],
                    Fall2026: [],
                    Winter2027: [],
                    Spring2027: [],
                };

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    // ... (same as before)
                    if (data.Fall2025) {
                        schedulesData.Fall2025.push({
                            id: doc.id,
                            semester: "Fall2025",
                            ...data.Fall2025,
                        });
                    }
                    if (data.Fall2026) {
                        schedulesData.Fall2026.push({
                            id: doc.id,
                            semester: "Fall2026",
                            ...data.Fall2026,
                        });
                    }
                    if (data.Spring2026) {
                        schedulesData.Spring2026.push({
                            id: doc.id,
                            semester: "Spring2026",
                            ...data.Spring2026,
                        });
                    }
                    if (data.Spring2027) {
                        schedulesData.Spring2027.push({
                            id: doc.id,
                            semester: "Spring2027",
                            ...data.Spring2027,
                        });
                    }
                    if (data.Winter2026) {
                        schedulesData.Winter2026.push({
                            id: doc.id,
                            semester: "Winter2026",
                            ...data.Winter2026,
                        });
                    }
                    if (data.Winter2027) {
                        schedulesData.Winter2027.push({
                            id: doc.id,
                            semester: "Winter2027",
                            ...data.Winter2027,
                        });
                    }
                    if (data.Summer2026) {
                        schedulesData.Summer2026.push({
                            id: doc.id,
                            semester: "Summer2026",
                            ...data.Summer2026,
                        });
                    }
                });
                setSchedules(schedulesData);
            },
            (error) => {
                console.error("Error fetching schedules:", error);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleAddSchedule = async (semester, scheduleData) => {
        try {
            await addDoc(collection(db, "schedule"), {
                [semester]: scheduleData
            });
        } catch (error) {
            console.error("Error adding schedule:", error);
            alert("Error adding schedule. Please try again.");
        }
    };

    const handleDeleteSchedule = async (scheduleId) => {
        try {
            await deleteDoc(doc(db, "schedule", scheduleId));
        } catch (error) {
            console.error("Error deleting schedule:", error);
            alert("Error deleting schedule. Please try again.");
        }
    };

    const semesters = [
        { value: "Fall2025", label: "Fall 2025", color: "from-orange-500 to-red-500" },
        { value: "Winter2026", label: "Winter 2026", color: "from-blue-500 to-cyan-500" },
        { value: "Spring2026", label: "Spring 2026", color: "from-green-500 to-emerald-500" },
        { value: "Summer2026", label: "Summer 2026", color: "from-yellow-500 to-amber-500" },
        { value: "Fall2026", label: "Fall 2026", color: "from-orange-500 to-red-500" },
        { value: "Winter2027", label: "Winter 2027", color: "from-blue-500 to-cyan-500" },
        { value: "Spring2027", label: "Spring 2027", color: "from-green-500 to-emerald-500" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header headerProps={
                {
                    title: 'Academic Scheduler',
                    navLinks: [
                        {label: 'Home', path: '/home'},
                        {label: 'Study Plan', path: '/studyPlan'},
                        {label: 'Job Search', path: '/jobSearch'}
                    ]
                }
            } />

            <div className="container mx-auto px-4 py-8 mt-14" >
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        📚 Academic Schedule & Calendar
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Manage your semester schedules, track exam dates, and monitor your study progress all in one place.
                    </p>
                </div>

                {/* Study Calendar */}
                <StudyCalendar
                    selectedSemester={selectedSemester}
                    schedules={schedules[selectedSemester]}
                />

                {/* Semester Selection */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Semester</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {semesters.map((semester) => (
                            <button
                                key={semester.value}
                                onClick={() => setSelectedSemester(semester.value)}
                                className={`p-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                    selectedSemester === semester.value
                                        ? `bg-gradient-to-r ${semester.color} ring-4 ring-white ring-opacity-50`
                                        : `bg-gradient-to-r ${semester.color} opacity-80 hover:opacity-100`
                                }`}
                            >
                                {semester.label.split(' ')[0]}<br/>
                                {semester.label.split(' ')[1]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Current Semester Info */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-6 mb-8 text-white">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                {semesters.find(s => s.value === selectedSemester)?.label}
                            </h2>
                            <p className="text-blue-100">
                                {schedules[selectedSemester].length} scheduled classes across {new Set(schedules[selectedSemester].map(s => s.day)).size} days
                            </p>
                        </div>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {new Set(schedules[selectedSemester].map(s => s.day)).size}
                                </div>
                                <div className="text-sm text-blue-200">Active Days</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {schedules[selectedSemester].length}
                                </div>
                                <div className="text-sm text-blue-200">Total Classes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {schedules[selectedSemester].length * 1.5}h
                                </div>
                                <div className="text-sm text-blue-200">Weekly Hours</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Schedule Form */}
                <AddScheduleForm
                    selectedSemester={selectedSemester}
                    onAddSchedule={handleAddSchedule}
                />

                {/* Schedule Table */}
                <ScheduleTable
                    schedule={schedules[selectedSemester]}
                    selectedSemester={selectedSemester}
                    onDeleteSchedule={handleDeleteSchedule}
                />
            </div>
        </div>
    );
}