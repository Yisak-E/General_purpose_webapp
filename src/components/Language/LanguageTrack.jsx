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
import largeVocabulary from './large-vocabulary.json'; // Import from external file
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
  const [wordStats, setWordStats] = useState({});
  const [currentWordId, setCurrentWordId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [vocabularyStats, setVocabularyStats] = useState({ total: 0, mastered: 0, learning: 0, needsPractice: 0 });
  const [skippedWords, setSkippedWords] = useState([]);
  const [showSkippedAnswer, setShowSkippedAnswer] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const wordsPerPage = 10;
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz', 'stats', 'words'

  // Function to seed the database with vocabulary from external file (only new words)
  const seedDatabase = async () => {
    const vocabCollectionRef = collection(db, "vocabulary");

    // Get all existing words from Firestore
    const existingSnapshot = await getDocs(vocabCollectionRef);
    const existingWords = new Set();

    existingSnapshot.forEach((doc) => {
      const data = doc.data();
      // Safely check if the document has the expected structure
      if (data.english && data.spanish &&
          typeof data.english === 'string' &&
          typeof data.spanish === 'string') {
        // Create a unique key for each word to check duplicates
        const wordKey = `${data.english.toLowerCase()}-${data.spanish.toLowerCase()}`;
        existingWords.add(wordKey);
      } else {
        console.warn('Skipping invalid document:', doc.id, data);
      }
    });

    console.log(`Found ${existingWords.size} valid existing words in database`);

    // Use large vocabulary if available, otherwise fall back to initial vocabulary
    const wordsToSeed = largeVocabulary && largeVocabulary.length > 0 ? largeVocabulary : initialVocabulary;

    // Filter out words that already exist and validate new words
    const newWords = wordsToSeed.filter(word => {
      // Validate the word structure
      if (!word.english || !word.spanish ||
          typeof word.english !== 'string' ||
          typeof word.spanish !== 'string') {
        console.warn('Skipping invalid word in vocabulary list:', word);
        return false;
      }

      const wordKey = `${word.english.toLowerCase()}-${word.spanish.toLowerCase()}`;
      return !existingWords.has(wordKey);
    });

    console.log(`Adding ${newWords.length} new words out of ${wordsToSeed.length} total`);

    if (newWords.length > 0) {
      // Add only new words in batches to avoid timeout
      const batchSize = 100;
      for (let i = 0; i < newWords.length; i += batchSize) {
        const batch = newWords.slice(i, i + batchSize);
        const promises = batch.map(word => addDoc(vocabCollectionRef, word));
        await Promise.all(promises);
        console.log(`Added batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(newWords.length / batchSize)}`);
      }
      setMessage(`Added ${newWords.length} new words to your vocabulary!`);
      setTimeout(() => setMessage(""), 5000);
    } else {
      console.log("No new words to add - all words already exist in database.");
    }
  };

  // Function to load the vocabulary from Firestore into local state
  const loadVocabulary = async () => {
    const querySnapshot = await getDocs(collection(db, "vocabulary"));
    const vocabList = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Only include valid vocabulary documents
      if (data.english && data.spanish &&
          typeof data.english === 'string' &&
          typeof data.spanish === 'string') {
        vocabList.push({ id: doc.id, ...data });
      } else {
        console.warn('Skipping invalid vocabulary document:', doc.id, data);
      }
    });
    setVocabulary(vocabList);
    console.log(`Loaded ${vocabList.length} valid words from database`);
  }

  // Calculate vocabulary statistics - UPDATED to use wordStats
  const calculateVocabularyStats = () => {
    if (vocabulary.length === 0) return;

    const stats = {
      total: vocabulary.length,
      mastered: 0,
      learning: 0,
      needsPractice: 0
    };

    vocabulary.forEach(word => {
      const percentage = getWordPercentage(word.id);
      if (percentage >= 80) {
        stats.mastered++;
      } else if (percentage >= 50) {
        stats.learning++;
      } else {
        stats.needsPractice++;
      }
    });

    setVocabularyStats(stats);
  };

  useEffect(() => {
    // Load Google Charts script
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.onload = () => {
      if (window.google && window.google.charts) {
        window.google.charts.load('current', { packages: ['corechart'] });
        window.google.charts.setOnLoadCallback(() => {
          setIsChartsLoaded(true);
        });
      }
    };
    document.head.appendChild(script);

    const initializeApp = async () => {
      setIsLoading(true);
      try {
        await seedDatabase();
        await loadVocabulary();
        await loadUserStats();
      } catch (error) {
        console.error("Error initializing app:", error);
        setMessage("Error loading vocabulary. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  // Update stats when wordStats changes
  useEffect(() => {
    calculateVocabularyStats();
  }, [wordStats, vocabulary]);

  const loadUserStats = async () => {
    try {
      const statsQuery = query(
        collection(db, "languageStats"),
        orderBy("date", "desc"),
      );
      const querySnapshot = await getDocs(statsQuery);
      const stats = [];
      const wordStatsTemp = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.date && data.date.toDate) {
          stats.push({ id: doc.id, ...data });

          // Track word-specific stats
          if (data.wordId) {
            if (!wordStatsTemp[data.wordId]) {
              wordStatsTemp[data.wordId] = { correct: 0, total: 0 };
            }
            if (data.correct) {
              wordStatsTemp[data.wordId].correct += 1;
            }
            wordStatsTemp[data.wordId].total += 1;
          }
        }
      });

      setStatsData(stats);
      setWordStats(wordStatsTemp);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const saveStat = async (isCorrectAnswer, wordId) => {
    try {
      await addDoc(collection(db, "languageStats"), {
        date: serverTimestamp(),
        correct: isCorrectAnswer,
        wordId: wordId,
        english: quizWord,
        spanish: correctAnswer
      });

      // Update local word stats
      setWordStats(prev => ({
        ...prev,
        [wordId]: {
          correct: prev[wordId] ? prev[wordId].correct + (isCorrectAnswer ? 1 : 0) : (isCorrectAnswer ? 1 : 0),
          total: prev[wordId] ? prev[wordId].total + 1 : 1
        }
      }));
    } catch (error) {
      console.error('Error saving stat:', error);
    }
  };

  const startQuiz = () => {
    if (vocabulary.length === 0) {
      setMessage("Loading vocabulary, please wait...");
      return;
    }

    // Filter out any invalid words and prioritize words that need practice
    const validVocabulary = vocabulary.filter(word =>
      word.english && word.spanish &&
      typeof word.english === 'string' &&
      typeof word.spanish === 'string'
    );

    if (validVocabulary.length === 0) {
      setMessage("No valid vocabulary words found. Please check your database.");
      return;
    }

    const wordsNeedingPractice = validVocabulary.filter(word => {
      const percentage = getWordPercentage(word.id);
      return percentage < 50 || percentage === 0; // Words with <50% or no attempts
    });

    // Use words needing practice if available, otherwise use all valid words
    const wordPool = wordsNeedingPractice.length > 0 ? wordsNeedingPractice : validVocabulary;

    // Filter out recently skipped words
    const availableWords = wordPool.filter(word => !skippedWords.includes(word.id));

    if (availableWords.length === 0) {
      // If all words are skipped, reset skipped words and use the original pool
      setSkippedWords([]);
      getRandomWord(wordPool);
    } else {
      getRandomWord(availableWords);
    }
  };

  const getRandomWord = (wordPool) => {
    const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
    setQuizWord(randomWord.english);
    setCorrectAnswer(randomWord.spanish);
    setCurrentWordId(randomWord.id);
    setUserTranslation("");
    setShowResult(false);
    setShowSkippedAnswer(false);
  };

  const skipWord = () => {
    if (currentWordId) {
      // Show the answer for 5 seconds
      setShowSkippedAnswer(true);
      setMessage(`Skipped "${quizWord}". The answer is: ${correctAnswer}`);

      // Add current word to skipped words list
      setSkippedWords(prev => [...prev, currentWordId]);

      // Save skip as a wrong answer for tracking
      saveStat(false, currentWordId);

      // Move to next word after 5 seconds
      setTimeout(() => {
        setShowSkippedAnswer(false);
        setMessage("");
        startQuiz();
      }, 5000);
    }
  };

  const quitQuiz = () => {
    setQuizWord("");
    setUserTranslation("");
    setShowResult(false);
    setShowSkippedAnswer(false);
    setMessage("Quiz ended. Your progress has been saved.");
    setTimeout(() => setMessage(""), 3000);
    setSkippedWords([]); // Reset skipped words when quitting
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
      saveStat(true, currentWordId);
    } else {
      setScore(prevScore => ({ ...prevScore, wrong: prevScore.wrong + 1 }));
      saveStat(false, currentWordId);
    }
  };

  const nextQuestion = () => {
    startQuiz();
  };

  // Calculate percentage for each word
  const getWordPercentage = (wordId) => {
    if (!wordStats[wordId] || wordStats[wordId].total === 0) return 0;
    return Math.round((wordStats[wordId].correct / wordStats[wordId].total) * 100);
  };

  // Sort words by percentage (lowest first for practice focus)
  const sortedVocabulary = [...vocabulary].sort((a, b) => {
    const percentageA = getWordPercentage(a.id);
    const percentageB = getWordPercentage(b.id);
    return percentageA - percentageB;
  });

  // Pagination functions
  const totalPages = Math.ceil(sortedVocabulary.length / wordsPerPage);
  const currentWords = sortedVocabulary.slice(
    currentPage * wordsPerPage,
    (currentPage + 1) * wordsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Chart configuration with better styling
  const chartOptions = {
    title: "Your Learning Progress",
    titleTextStyle: {
      fontSize: 16,
      bold: true,
      color: '#374151'
    },
    curveType: "function",
    legend: {
      position: "bottom",
      textStyle: {
        fontSize: 11,
        color: '#6B7280'
      }
    },
    hAxis: {
      title: "Date",
      titleTextStyle: {
        color: '#6B7280',
        fontSize: 11,
        bold: true
      },
      textStyle: {
        color: '#6B7280',
        fontSize: 10
      },
      slantedText: true,
      slantedTextAngle: 45,
      showTextEvery: 1
    },
    vAxis: {
      title: "Answers",
      titleTextStyle: {
        color: '#6B7280',
        fontSize: 11,
        bold: true
      },
      textStyle: {
        color: '#6B7280',
        fontSize: 10
      },
      viewWindow: { min: 0 },
      gridlines: {
        color: '#F3F4F6',
        count: 5
      }
    },
    colors: ["#10b981", "#ef4444"],
    pointSize: 4,
    backgroundColor: 'transparent',
    chartArea: {
      left: '15%',
      top: '15%',
      width: '80%',
      height: '60%'
    },
    lineWidth: 2,
    tooltip: {
      textStyle: {
        fontSize: 11
      }
    }
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

      // Add resize handler for responsiveness
      const handleResize = () => {
        chart.draw(dataTable, chartOptions);
      };

      window.addEventListener('resize', handleResize);
      chart.draw(dataTable, chartOptions);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [statsData, isChartsLoaded]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Loading vocabulary database...</p>
          <p className="text-sm text-gray-500">This may take a moment for large datasets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="container mx-auto px-4 py-8">
        <Header
          headerProps={{
            title: "Spanish Quiz",
            navLinks: [
              { label: "Study Plan", path: "/studyPlan" },
              { label: "Job Search", path: "/jobSearch" },
            ],
          }}
        />

        {/* Vocabulary Stats Overview - Always visible */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg p-3 text-center shadow">
            <div className="text-xl md:text-2xl font-bold text-blue-600">{vocabularyStats.total}</div>
            <div className="text-xs md:text-sm text-gray-600">Total Words</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow">
            <div className="text-xl md:text-2xl font-bold text-green-600">{vocabularyStats.mastered}</div>
            <div className="text-xs md:text-sm text-gray-600">Mastered</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow">
            <div className="text-xl md:text-2xl font-bold text-yellow-600">{vocabularyStats.learning}</div>
            <div className="text-xs md:text-sm text-gray-600">Learning</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow">
            <div className="text-xl md:text-2xl font-bold text-red-600">{vocabularyStats.needsPractice}</div>
            <div className="text-xs md:text-sm text-gray-600">Need Practice</div>
          </div>
        </div>

        {message && (
          <div className="p-3 mb-6 rounded-lg text-center bg-blue-100 text-blue-800 border border-blue-200">
            {message}
          </div>
        )}

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden mb-6">
          <div className="flex bg-white rounded-lg shadow p-1">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'quiz' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              🎯 Quiz
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'stats' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              📊 Stats
            </button>
            <button
              onClick={() => setActiveTab('words')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'words' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              📝 Words
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quiz Section */}
          <div className={`bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col justify-between ${
            activeTab !== 'quiz' && 'lg:block hidden'
          } ${activeTab === 'quiz' ? 'block' : 'hidden lg:block'}`}>
            {!quizWord ? (
              <div className="text-center my-auto">
                <p className="text-gray-600 mb-4 md:mb-6 text-base md:text-lg">Ready to test your Spanish?</p>
                <p className="text-xs md:text-sm text-gray-500 mb-4">Vocabulary database: {vocabulary.length} words</p>
                <button
                  onClick={startQuiz}
                  className="bg-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold text-base md:text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
                >
                  Start Quiz
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg border">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Translate this English word to Spanish:</p>
                  <p className="text-xl md:text-3xl font-bold text-gray-800">{quizWord}</p>
                  <div className="mt-1 md:mt-2 text-xs text-gray-400">
                    Word {vocabulary.findIndex(w => w.id === currentWordId) + 1} of {vocabulary.length}
                    {skippedWords.length > 0 && ` • ${skippedWords.length} skipped`}
                  </div>
                </div>

                {/* Show skipped answer for 5 seconds */}
                {showSkippedAnswer && (
                  <div className="mb-4 p-3 md:p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
                    <p className="text-base md:text-lg font-semibold text-yellow-800">
                      The answer is: <span className="font-bold">{correctAnswer}</span>
                    </p>
                    <p className="text-xs md:text-sm text-yellow-600 mt-2">
                      Next word in 5 seconds...
                    </p>
                  </div>
                )}

                {!showSkippedAnswer && (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={userTranslation}
                      onChange={(e) => setUserTranslation(e.target.value)}
                      className="w-full p-2 md:p-3 border border-gray-300 rounded-lg text-base md:text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your translation..."
                      disabled={showResult}
                      onKeyPress={(e) => e.key === 'Enter' && !showResult && checkTranslation()}
                    />
                  </div>
                )}

                {showResult ? (
                  <div className={`p-3 md:p-4 rounded-lg mb-4 text-center ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <p className="font-bold text-lg md:text-xl">{isCorrect ? '¡Correcto! 🎉' : 'Incorrect 😞'}</p>
                    {!isCorrect && <p className="mt-1 md:mt-2 text-sm md:text-base">The correct answer is: <span className="font-bold">{correctAnswer}</span></p>}
                    <div className="flex gap-2 justify-center mt-3 md:mt-4">
                      <button
                        onClick={nextQuestion}
                        className="bg-blue-600 text-white px-4 md:px-6 py-1 md:py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm md:text-base"
                      >
                        Next Word
                      </button>
                      <button
                        onClick={quitQuiz}
                        className="bg-gray-500 text-white px-4 md:px-6 py-1 md:py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm md:text-base"
                      >
                        End Quiz
                      </button>
                    </div>
                  </div>
                ) : (
                  !showSkippedAnswer && (
                    <div className="space-y-2 md:space-y-3">
                      <button
                        onClick={checkTranslation}
                        className="w-full bg-blue-600 text-white py-2 md:py-3 rounded-lg font-semibold text-base md:text-lg hover:bg-blue-700 transition-colors"
                      >
                        Check Answer
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={skipWord}
                          className="flex-1 bg-yellow-500 text-white py-1 md:py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors text-sm md:text-base"
                        >
                          Skip Word
                        </button>
                        <button
                          onClick={quitQuiz}
                          className="flex-1 bg-red-500 text-white py-1 md:py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm md:text-base"
                        >
                          Quit Quiz
                        </button>
                      </div>
                    </div>
                  )
                )}
                <div className="mt-4 md:mt-6 flex justify-around border-t pt-3 md:pt-4">
                  <div className="text-center">
                    <p className="text-xl md:text-3xl font-bold text-green-600">{score.correct}</p>
                    <p className="text-xs md:text-sm text-gray-500">Correct</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl md:text-3xl font-bold text-red-600">{score.wrong}</p>
                    <p className="text-xs md:text-sm text-gray-500">Wrong</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl md:text-3xl font-bold text-yellow-600">{skippedWords.length}</p>
                    <p className="text-xs md:text-sm text-gray-500">Skipped</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Analytics Chart */}
          <div className={`bg-white rounded-xl shadow-lg p-4 md:p-6 ${
            activeTab !== 'stats' && 'lg:block hidden'
          } ${activeTab === 'stats' ? 'block' : 'hidden lg:block'}`}>
            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-center text-gray-700">Your Progress</h2>
            {statsData.length > 1 ? (
              <div className="relative" style={{ minHeight: '300px' }}>
                <div
                  id="line_chart_div"
                  className="w-full"
                  style={{
                    height: '300px',
                    minWidth: '100%',
                    position: 'relative'
                  }}
                ></div>
                <div className="mt-3 text-center text-xs md:text-sm text-gray-500">
                  <p>Track your daily progress in learning Spanish</p>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center justify-center text-center text-gray-500 rounded-lg border-2 border-dashed border-gray-300"
                style={{ height: '300px' }}
              >
                <div className="p-4 md:p-6">
                  <div className="text-4xl md:text-6xl mb-3 md:mb-4">📊</div>
                  <p className="mb-2 text-base md:text-lg font-medium">No data yet</p>
                  <p className="text-xs md:text-sm max-w-xs">Complete quizzes to see your progress chart!</p>
                </div>
              </div>
            )}
          </div>

          {/* Word Statistics Section */}
          <div className={`bg-white rounded-xl shadow-lg p-4 md:p-6 ${
            activeTab !== 'words' && 'lg:block hidden'
          } ${activeTab === 'words' ? 'block' : 'hidden lg:block'}`}>
            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-center text-gray-700">Word Statistics</h2>
            <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto">
              {vocabulary.length > 0 ? (
                <div>
                  <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                    {currentWords.map((word) => {
                      const percentage = getWordPercentage(word.id);
                      const attempts = wordStats[word.id] ? wordStats[word.id].total : 0;

                      return (
                        <div
                          key={word.id}
                          className={`p-2 md:p-3 border rounded-lg transition-all duration-200 ${
                            word.id === currentWordId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                          } ${skippedWords.includes(word.id) ? 'opacity-60' : ''}`}
                        >
                          <div className="flex justify-between items-center mb-1 md:mb-2">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800 text-sm md:text-base">{word.english}</div>
                              <div className="text-xs md:text-sm text-gray-600">{word.spanish}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-base md:text-lg font-bold text-gray-700">{percentage}%</div>
                              <div className="text-xs text-gray-500">{attempts} attempts</div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-1 md:h-2">
                            <div
                              className={`h-1 md:h-2 rounded-full transition-all duration-500 ${
                                percentage >= 80 ? 'bg-green-500' : 
                                percentage >= 50 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>

                          {/* Status Indicator */}
                          <div className="flex justify-between items-center mt-1">
                            <span className={`text-xs font-medium ${
                              percentage >= 80 ? 'text-green-600' : 
                              percentage >= 50 ? 'text-yellow-600' : 
                              'text-red-600'
                            }`}>
                              {percentage >= 80 ? 'Mastered' :
                              percentage >= 50 ? 'Learning' :
                              'Needs Practice'}
                              {skippedWords.includes(word.id) && ' • Skipped'}
                            </span>
                            {wordStats[word.id] && (
                              <span className="text-xs text-gray-500">
                                {wordStats[word.id].correct}/{wordStats[word.id].total} correct
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center border-t pt-3 md:pt-4">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className={`px-3 md:px-4 py-1 md:py-2 rounded-lg font-semibold text-xs md:text-sm ${
                          currentPage === 0 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        Previous
                      </button>
                      <span className="text-xs md:text-sm text-gray-600">
                        Page {currentPage + 1} of {totalPages}
                      </span>
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages - 1}
                        className={`px-3 md:px-4 py-1 md:py-2 rounded-lg font-semibold text-xs md:text-sm ${
                          currentPage === totalPages - 1
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-center text-gray-500">
                  <p className="text-sm md:text-base">No vocabulary loaded. Please check your database connection.</p>
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
              <div className="text-center text-xs md:text-sm text-gray-600 mb-2">
                Progress Overview
              </div>
              <div className="grid grid-cols-3 gap-1 md:gap-2 text-center">
                <div className="bg-green-50 rounded p-1 md:p-2">
                  <div className="text-base md:text-lg font-bold text-green-600">{vocabularyStats.mastered}</div>
                  <div className="text-xs text-green-800">Mastered</div>
                </div>
                <div className="bg-yellow-50 rounded p-1 md:p-2">
                  <div className="text-base md:text-lg font-bold text-yellow-600">{vocabularyStats.learning}</div>
                  <div className="text-xs text-yellow-800">Learning</div>
                </div>
                <div className="bg-red-50 rounded p-1 md:p-2">
                  <div className="text-base md:text-lg font-bold text-red-600">{vocabularyStats.needsPractice}</div>
                  <div className="text-xs text-red-800">Practice</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}