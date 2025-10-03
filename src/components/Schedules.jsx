import {db} from '../api/firebaseConfigs.js'
import Header from "./headers/Header.jsx";
import {useState, useEffect} from "react";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

function ScheduleTable({schedule}) {
    const [day, setDay] = useState("Monday");

    const handleChange = (e) => {
        setDay(e.target.value);
    }

    // Filter schedules by selected day
    const filteredSchedules = schedule.filter(item => item.day === day);

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
                </tr>
                </thead>
                <tbody>
                {filteredSchedules.length > 0 ? (
                    filteredSchedules.map((scheduleItem, index) => (
                        <tr key={scheduleItem.id || index} className={'w-full gap-6 h-12 text-center'}>
                            <td className={'border-gray-300 border-1'}>{scheduleItem.course}</td>
                            <td className={'border-gray-300 border-1'}>{scheduleItem.time}</td>
                            <td className={'border-gray-300 border-1'}>{scheduleItem.room}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="text-center py-4">No schedules found for {day}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    );
}

export default function Schedules() {
    const [schedules, setSchedules] = useState({
        Fall2025: [],
        Winter2026: [], // Fixed case
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
                    Winter2026: [], // Fixed case
                    Spring2026: [],
                    Summer2026: [],
                    Fall2026: [],
                    Winter2027: [],
                    Spring2027: [],
                };

                snapshot.forEach((doc) => {
                    const data = doc.data();

                    // Check each semester field and push to the correct array
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
                            ...data.Fall2026, // Fixed: was spreading Fall2025
                        });
                    }
                    if (data.Spring2026) {
                        schedulesData.Spring2026.push({
                            id: doc.id,
                            semester: "Spring2026",
                            ...data.Spring2026, // Fixed: was spreading Fall2025
                        });
                    }
                    if (data.Spring2027) {
                        schedulesData.Spring2027.push({
                            id: doc.id,
                            semester: "Spring2027",
                            ...data.Spring2027, // Fixed: was spreading Fall2025
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

                {/* Pass only the selected semester's schedules */}
                <ScheduleTable schedule={schedules[selectedSemester]} />
            </div>
        </>
    );
}