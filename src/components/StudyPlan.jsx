import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  onSnapshot
} from "firebase/firestore";
import { db } from '../api/firebaseConfigs.js'; // Adjust path as needed
import Header from "./headers/Header.jsx";

function StudyPlan() {
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize study plan in Firestore
  const initializeStudyPlan = async () => {
    const defaultStudyPlan = {
      program: "Bachelor of Science in Software Engineering",
      total_credit_hours: 135,
      semesters: [
        {
          name: "Semester 1",
          year: "First Year (Freshman)",
          courses: [
            { code: "ENG200", title: "English II", credits: 3, taken: true },
            { code: "FWS205", title: "UAE and GCC Society", credits: 3, taken: true },
            { code: "ARL101", title: "Communication Skills in Arabic I", credits: 3, taken: true },
            { code: "MTT102", title: "Calculus I", credits: 3, taken: true },
            { code: "STT100", title: "General Statistics", credits: 3, taken: true },
            { code: "ISL100", title: "Islamic Culture", credits: 3, taken: true }
          ],
          total_credits: 18
        },
        {
          name: "Semester 2",
          year: "First Year (Freshman)",
          courses: [
            { code: "PHY102", title: "Physics and Engineering Applications I", credits: 3, taken: true },
            { code: "PHY102L", title: "Physics and Engineering Applications I Lab", credits: 1, taken: true },
            { code: "CHE205", title: "General Chemistry I", credits: 3, taken: true },
            { code: "CHE201L", title: "Chemistry Lab", credits: 1, taken: false },
            { code: "MTT200", title: "Calculus II", credits: 3, taken: true },
            { code: "COE102", title: "Introductory Big Data Analytics", credits: 3, taken: true },
            { code: "OE1", title: "Open Elective I", credits: 3, taken: false }
          ],
          total_credits: 17
        },
        {
          name: "Semester 3",
          year: "Second Year (Sophomore)",
          courses: [
            { code: "SWE201", title: "Structured Programming", credits: 3, taken: true },
            { code: "PHY201", title: "Physics and Engineering Applications II", credits: 3, taken: true },
            { code: "PHY201L", title: "Physics and Engineering Applications II Lab", credits: 1, taken: true },
            { code: "STT201", title: "Intermediate Statistics and Research Methods", credits: 3, taken: true },
            { code: "MTT202", title: "Discrete Mathematics", credits: 3, taken: true },
            { code: "OE2", title: "Open Elective II", credits: 3, taken: false }
          ],
          total_credits: 16
        },
        {
          name: "Semester 4",
          year: "Second Year (Sophomore)",
          courses: [
            { code: "CSC202", title: "Programming II", credits: 3, taken: true },
            { code: "CSC307", title: "Web Design", credits: 3, taken: true },
            { code: "CSC302", title: "Database Management Systems", credits: 3, taken: true },
            { code: "FWS305", title: "Technical Communications for Workplace", credits: 3, taken: true },
            { code: "MTT204", title: "Introduction to Linear Algebra", credits: 3, taken: true },
            { code: "COE202", title: "Engineering Ethics, Economy, and Law", credits: 3, taken: true }
          ],
          total_credits: 18
        },
        {
          name: "Summer Semester",
          courses: [
            { code: "SWE399A", title: "Internship/Project in Software Engineering I", credits: 1.5, taken: false }
          ]
        },
        {
          name: "Semester 5",
          year: "Third Year (Junior)",
          courses: [
            { code: "CSC301", title: "Data Structures and Algorithms", credits: 3, taken: true },
            { code: "CSC305", title: "Data Communications and Networks", credits: 3, taken: true },
            { code: "ITE390", title: "Computer Ethics", credits: 3, taken: true },
            { code: "SWE371", title: "Software Requirements and Specification", credits: 3, taken: true },
            { code: "SWE401", title: "Software Engineering", credits: 3, taken: true },
            { code: "SWE370", title: "Object Oriented Design Patterns", credits: 3, taken: true }
          ],
          total_credits: 18
        },
        {
          name: "Semester 6",
          year: "Third Year (Junior)",
          courses: [
            { code: "CSC308", title: "Operating Systems", credits: 3, taken: false },
            { code: "CSC406", title: "Artificial Intelligence", credits: 3, taken: false },
            { code: "ITE422", title: "System and Network Administration", credits: 3, taken: false },
            { code: "ITE421", title: "Native Mobile Application Development", credits: 3, taken: false },
            { code: "SWE302", title: "Formal Methods in Software Engineering", credits: 3, taken: false },
            { code: "SWE471", title: "Software Design and Architecture", credits: 3, taken: false }
          ],
          total_credits: 18
        },
        {
          name: "Summer Semester",
          courses: [
            { code: "SWE399B", title: "Internship/Project in Software Engineering II", credits: 1.5, taken: false }
          ]
        },
        {
          name: "Semester 7",
          year: "Fourth Year (Senior)",
          courses: [
            { code: "ITE408", title: "Information Security", credits: 3, taken: false },
            { code: "ITE409", title: "Human Computer Interactions", credits: 3, taken: false },
            { code: "SWE472", title: "Software Testing and Quality Assurance", credits: 3, taken: false },
            { code: "ME1", title: "Major Elective I", credits: 3, taken: false },
            { code: "SWE499A", title: "Capstone Design Project in SWE Part A", credits: 1, taken: false }
          ],
          total_credits: 13
        },
        {
          name: "Semester 8",
          year: "Fourth Year (Senior)",
          courses: [
            { code: "CSC408", title: "Distributed Information Systems", credits: 3, taken: false },
            { code: "SWE473", title: "Software Maintenance and Evolution", credits: 3, taken: false },
            { code: "ME2", title: "Major Elective II", credits: 3, taken: false },
            { code: "FWS310", title: "Fundamentals of Innovation and Entrepreneurship", credits: 3, taken: false },
            { code: "SWE499B", title: "Capstone Design Project in SWE Part B", credits: 2, taken: false }
          ],
          total_credits: 14
        }
      ]
    };

    try {
      const studyPlanRef = doc(collection(db, "studyPlans"), "userStudyPlan");
      await setDoc(studyPlanRef, defaultStudyPlan);
      console.log("Study plan initialized in Firestore");
    } catch (error) {
      console.error("Error initializing study plan:", error);
    }
  };

  // Load study plan from Firestore
  useEffect(() => {
    const loadStudyPlan = async () => {
      try {
        const studyPlanRef = doc(collection(db, "studyPlans"), "userStudyPlan");

        // Set up real-time listener
        const unsubscribe = onSnapshot(studyPlanRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setStudyPlan(docSnapshot.data());
            // Set first semester as default selected
            if (!selectedSemester && docSnapshot.data().semesters.length > 0) {
              setSelectedSemester(docSnapshot.data().semesters[0]);
            }
          } else {
            // Initialize if doesn't exist
            initializeStudyPlan();
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error loading study plan:", error);
        setLoading(false);
      }
    };

    loadStudyPlan();
  }, []);

  // Update course status in Firestore
  const updateCourseStatus = async (semesterName, courseCode, newStatus) => {
    if (!studyPlan) return;

    try {
      const studyPlanRef = doc(collection(db, "studyPlans"), "userStudyPlan");

      // Create updated semesters array
      const updatedSemesters = studyPlan.semesters.map(semester => {
        if (semester.name === semesterName) {
          const updatedCourses = semester.courses.map(course =>
            course.code === courseCode ? { ...course, taken: newStatus } : course
          );
          return { ...semester, courses: updatedCourses };
        }
        return semester;
      });

      // Update Firestore
      await updateDoc(studyPlanRef, {
        semesters: updatedSemesters
      });

      console.log("Course status updated successfully");
    } catch (error) {
      console.error("Error updating course status:", error);
    }
  };

  // Calculate progress statistics
  const calculateProgress = () => {
    if (!studyPlan) return { totalCourses: 0, completedCourses: 0, progressPercentage: 0 };

    let totalCourses = 0;
    let completedCourses = 0;

    studyPlan.semesters.forEach(semester => {
      semester.courses.forEach(course => {
        totalCourses++;
        if (course.taken) completedCourses++;
      });
    });

    const progressPercentage = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

    return { totalCourses, completedCourses, progressPercentage };
  };

  const progress = calculateProgress();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading study plan...</p>
        </div>
      </div>
    );
  }

  if (!studyPlan) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load study plan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-full min-h-screen bg-gray-100">
      <Header headerProps={{
        title: 'Study Plan',
        navLinks: [
          { label: 'Home', path: '/' },
          { label: 'Schedules', path: '/schedule' },
          { label: 'Job Search', path: '/jobSearch' }
        ]
      }} />

      <div className="container mx-auto px-4 py-6">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{studyPlan.program}</h1>
              <p className="text-gray-600 mt-1">
                Total Credit Hours: <span className="font-semibold">{studyPlan.total_credit_hours}</span>
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-center">
              <div className="text-3xl font-bold text-green-600">{progress.progressPercentage}%</div>
              <div className="text-sm text-gray-600">
                {progress.completedCourses} of {progress.totalCourses} courses completed
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress.progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Semester Navigation */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Semesters</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {studyPlan.semesters.map((semester, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSemester(semester)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    selectedSemester?.name === semester.name
                      ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="font-semibold">{semester.name}</div>
                  {semester.year && (
                    <div className="text-sm text-gray-600">{semester.year}</div>
                  )}
                  <div className="text-sm text-gray-500 mt-1">
                    {semester.courses.filter(course => course.taken).length} / {semester.courses.length} completed
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Course Details */}
          <div className="lg:col-span-3">
            {selectedSemester ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedSemester.name}</h2>
                  {selectedSemester.year && (
                    <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {selectedSemester.year}
                    </span>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Course Code</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Course Name</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Credit Hours</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSemester.courses.map((course, courseIndex) => (
                        <tr key={course.code + courseIndex} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 border-b font-mono text-sm">{course.code}</td>
                          <td className="py-3 px-4 border-b">{course.title}</td>
                          <td className="py-3 px-4 border-b text-center">{course.credits}</td>
                          <td className="py-3 px-4 border-b">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.taken 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {course.taken ? 'Completed' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4 border-b">
                            <button
                              onClick={() => updateCourseStatus(selectedSemester.name, course.code, !course.taken)}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                course.taken
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {course.taken ? 'Mark Pending' : 'Mark Completed'}
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-semibold">
                        <td className="py-3 px-4 border-b" colSpan="2">Total Credit Hours</td>
                        <td className="py-3 px-4 border-b text-center">{selectedSemester.total_credits}</td>
                        <td className="py-3 px-4 border-b"></td>
                        <td className="py-3 px-4 border-b"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Semester</h3>
                <p className="text-gray-500">Choose a semester from the left panel to view its courses</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyPlan;