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

function ScheduleTable({schedule, selectedSemester, onDeleteSchedule}) {
    const [day, setDay] = useState("Monday");

    const handleChange = (e) => {
        setDay(e.target.value);
    }

    // Filter schedules by selected day
    const filteredSchedules = schedule.filter(item => item.day === day);

    const handleDelete = async (scheduleId) => {
        if (window.confirm("Are you sure you want to delete this schedule?")) {
            await onDeleteSchedule(scheduleId);
        }
    };

    return (
        <>
            <form className="mt-4">
                <label htmlFor={'daySelection'}
                className={'w-56 bg-amber-300 px-2 py-1 text-2xl'}
                >Show For: </label>
                <select name={'daySelection'}
                        value={day}
                        onChange={handleChange}
                        className={'w-56 bg-gray-200 px-2 py-1 text-2xl'}>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                </select>
            </form>

            <table className={'bg-black text-white w-full'}>
                <thead>
                <tr className={'w-full gap-6 h-12 border-white border-b-2'}>
                    <th>Course</th>
                    <th>Time</th>
                    <th>Room</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredSchedules.length > 0 ? (
                    filteredSchedules.map((scheduleItem, index) => (
                        <tr key={scheduleItem.id || index} className={'w-full gap-6 h-12 text-center'}>
                            <td className={'border-gray-300 border-1'}>{scheduleItem.course}</td>
                            <td className={'border-gray-300 border-1'}>{scheduleItem.time}</td>
                            <td className={'border-gray-300 border-1'}>{scheduleItem.room}</td>
                            <td className={'border-gray-300 border-1'}>
                                <button
                                    onClick={() => handleDelete(scheduleItem.id)}
                                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center py-4">No schedules found for {day}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    );
}

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
        <div className="mt-4">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded text-xl"
            >
                + Add New Schedule
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-2xl font-bold mb-4 text-black">Add New Schedule - {selectedSemester}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Course Code
                                </label>
                                <input
                                    type="text"
                                    name="course"
                                    value={formData.course}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                                    placeholder="e.g., SWE370"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Day
                                </label>
                                <select
                                    name="day"
                                    value={formData.day}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                                >
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Time
                                </label>
                                <input
                                    type="text"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                                    placeholder="e.g., 12:50 pm"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Room
                                </label>
                                <input
                                    type="text"
                                    name="room"
                                    value={formData.room}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                                    placeholder="e.g., D-IF-8A"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
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

    return (
        <>
            <div className="container px-4 py-0 min-w-full min-h-screen">
                <Header headerProps={
                    {
                        title: 'Schedules',
                        navLinks: [
                            {label: 'Home', path: '/'},
                            {label: 'Study Plan', path: '/studyPlan'},
                            {label: 'Job Search', path: '/jobSearch'}
                        ]
                    }
                } />

                {/* Semester Selection */}
                <div className="mt-4">
                    <label htmlFor="semesterSelection" className="w-56 bg-amber-300 px-2 py-1 text-2xl">
                        Semester:
                    </label>
                    <select
                        id="semesterSelection"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="w-56 bg-gray-200 px-2 py-1 text-2xl"
                    >
                        <option value="Fall2025">Fall 2025</option>
                        <option value="Winter2026">Winter 2026</option>
                        <option value="Spring2026">Spring 2026</option>
                        <option value="Summer2026">Summer 2026</option>
                        <option value="Fall2026">Fall 2026</option>
                        <option value="Winter2027">Winter 2027</option>
                        <option value="Spring2027">Spring 2027</option>
                    </select>
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
        </>
    );
}