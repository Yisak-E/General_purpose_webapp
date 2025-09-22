import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  getCountFromServer
} from "firebase/firestore";
import { db } from '../../api/firebaseConfigs.js';
import { initialVocabulary } from './initialVocabulary.js';
import Header from "../headers/Header.jsx";

export default function LanguageTrack() {
  const [message, setMessage] = useState("");
  const [quizWord, setQuizWord] = useState("");
  const [userTranslation, setUserTranslation] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [statsData, setStatsData] = useState([]);
  const [vocabulary, setVocabulary] = useState([]);
  const [isChartsLoaded, setIsChartsLoaded] = useState(false);

  // Function to seed the database one time with the initial vocabulary list
  const seedDatabase = async () => {
    const vocabCollectionRef = collection(db, "vocabulary");
    const snapshot = await getCountFromServer(vocabCollectionRef);

    if (snapshot.data().count === 0) {
      console.log("Database is empty. Seeding with initial vocabulary...");
      const promises = initialVocabulary.map(word => addDoc(vocabCollectionRef, word));
      await Promise.all(promises);
      console.log("Database seeding complete.");
    } else {
      console.log("Database already contains vocabulary. Skipping seed.");
    }
  };

  // Function to load the vocabulary from Firestore into local state
  const loadVocabulary = async () => {
    const querySnapshot = await getDocs(collection(db, "vocabulary"));
    const vocabList = [];
    querySnapshot.forEach((doc) => {
      vocabList.push(doc.data());
    });
    setVocabulary(vocabList);
  }

  useEffect(() => {
    // Load Google Charts script
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.onload = () => {
      // The google object may not be immediately available
      if (window.google && window.google.charts) {
        window.google.charts.load('current', { packages: ['corechart'] });
        window.google.charts.setOnLoadCallback(() => {
          setIsChartsLoaded(true);
        });
      }
    };
    document.head.appendChild(script);

    const initializeApp = async () => {
        await seedDatabase();
        await loadVocabulary();
        await loadUserStats();
    };
    initializeApp();
  }, []);

  const loadUserStats = async () => {
    try {
      const statsQuery = query(
        collection(db, "languageStats"),
        orderBy("date", "desc"),
      );
      const querySnapshot = await getDocs(statsQuery);
      const stats = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().date && doc.data().date.toDate) {
             stats.push({ id: doc.id, ...doc.data() });
        }
      });
      setStatsData(stats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const saveStat = async (isCorrectAnswer) => {
    try {
      await addDoc(collection(db, "languageStats"), {
        date: serverTimestamp(),
        correct: isCorrectAnswer,
      });
    } catch (error) {
      console.error("Error saving stat:", error);
    }
  };

  const startQuiz = () => {
    if (vocabulary.length === 0) {
        setMessage("Loading vocabulary, please wait...");
        return;
    }
    const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    setQuizWord(randomWord.english);
    setCorrectAnswer(randomWord.spanish);
    setUserTranslation("");
    setShowResult(false);
  };

  const checkTranslation = () => {
    if (!userTranslation.trim()) {
      setMessage("Please enter your translation");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const isTranslationCorrect = userTranslation.toLowerCase().trim() === correctAnswer.toLowerCase();
    setIsCorrect(isTranslationCorrect);
    setShowResult(true);

    if (isTranslationCorrect) {
      setScore(prevScore => ({ ...prevScore, correct: prevScore.correct + 1 }));
      saveStat(true);
    } else {
      setScore(prevScore => ({ ...prevScore, wrong: prevScore.wrong + 1 }));
      saveStat(false);
    }
  };

  const nextQuestion = () => {
    startQuiz();
  };

  const chartOptions = {
    title: "Your Learning Progress",
    curveType: "function",
    legend: { position: "bottom" },
    hAxis: { title: "Date", slantedText: true, slantedTextAngle: 30 },
    vAxis: { title: "Answers", viewWindow: { min: 0 } },
    colors: ["#10b981", "#ef4444"],
    pointSize: 5,
    backgroundColor: 'transparent',
  };

  useEffect(() => {
    if (isChartsLoaded && statsData.length > 1 && window.google) {
      const getChartData = () => {
        const data = [["Date", "Correct", "Wrong"]];
        const statsByDate = {};

        statsData.forEach(stat => {
          const date = stat.date.toDate().toLocaleDateString();
          if (!statsByDate[date]) {
            statsByDate[date] = { correct: 0, wrong: 0 };
          }
          if (stat.correct) {
            statsByDate[date].correct += 1;
          } else {
            statsByDate[date].wrong += 1;
          }
        });

        const sortedDates = Object.keys(statsByDate).sort((a, b) => new Date(a) - new Date(b));
        sortedDates.forEach(date => {
            data.push([date, statsByDate[date].correct, statsByDate[date].wrong]);
        });
        return data;
      };

      const dataTable = window.google.visualization.arrayToDataTable(getChartData());
      const chart = new window.google.visualization.LineChart(document.getElementById('line_chart_div'));
      chart.draw(dataTable, chartOptions);
    }
  }, [statsData, isChartsLoaded]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 font-sans">
      <div className="container mx-auto px-4">

         <Header
          headerProps={{
            title: "Spanish Quiz",
            navLinks: [
              { label: "Study Plan", path: "/studyPlan" },
              { label: "Job Search", path: "/jobSearch" },
            ],
          }}
        />

        {message && (
          <div className="p-3 mb-6 rounded-lg text-center bg-blue-100 text-blue-800 border border-blue-200">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-5">
          {/* Quiz Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between">
            {!quizWord ? (
              <div className="text-center my-auto">
                <p className="text-gray-600 mb-6 text-lg">Ready to start?</p>
                <button
                  onClick={startQuiz}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
                >
                  Start Quiz
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-500 mb-1">Translate this English word to Spanish:</p>
                  <p className="text-3xl font-bold text-gray-800">{quizWord}</p>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    value={userTranslation}
                    onChange={(e) => setUserTranslation(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your translation..."
                    disabled={showResult}
                    onKeyPress={(e) => e.key === 'Enter' && !showResult && checkTranslation()}
                  />
                </div>
                {showResult ? (
                  <div className={`p-4 rounded-lg mb-4 text-center ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <p className="font-bold text-xl">{isCorrect ? '¡Correcto! 🎉' : 'Incorrect 😞'}</p>
                    {!isCorrect && <p className="mt-2">The correct answer is: <span className="font-bold">{correctAnswer}</span></p>}
                    <button
                        onClick={nextQuestion}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Next Word
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={checkTranslation}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                  >
                    Check Answer
                  </button>
                )}
                <div className="mt-6 flex justify-around border-t pt-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{score.correct}</p>
                    <p className="text-gray-500">Correct</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">{score.wrong}</p>
                    <p className="text-gray-500">Wrong</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Analytics Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Your Progress</h2>
            {statsData.length > 1 ? (
              <div id="line_chart_div" style={{width: '100%', height: '400px'}}></div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <p>Complete a few quizzes over time to see your progress chart grow!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

