import React, {useState, useEffect} from 'react';
import Header from "../headers/Header.jsx";
import useIsMobile from "./UseIsMobile.jsx";
import { db } from '../../api/firebaseConfigs.js';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  updateDoc,
  doc
} from 'firebase/firestore';
import { Chart } from 'react-google-charts';

export default function MemoryGame() {
    const [notification, setNotification] = useState('');
    const [flipCount, setFlipCount] = useState(0);
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [score, setScore] = useState(0);
    const [userName, setUserName] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showAllCards, setShowAllCards] = useState(false);
    const [scores, setScores] = useState([]);
    const [showScoreForm, setShowScoreForm] = useState(false);
    const [difficulty, setDifficulty] = useState('junior');
    const [selectedCards, setSelectedCards] = useState([]);
    const [indexError, setIndexError] = useState('');
    const isMobile = useIsMobile()
    const [showNow, setShowNow] = useState({
            info: false,
            game: true,
            stat:false,
            });

    // Different emoji sets for different difficulties
    const emojiSets = {
        junior: ["🐎","🐘", "🦤", "🪰", "🦋", "🪼", "🐦‍🔥", "🐋"],
        senior: ["🚀", "🌟", "🌈", "🎮", "🎯", "🎨", "🎭", "🎪", "🎸", "🎹", "🎬", "🎲", "🧩", "🎳", "🕹️", "🎠"],
        expert: ["⚡", "🔥", "💧", "🌪️", "❄️", "🌊", "🌋", "🌀", "🌈", "🌟", "💫", "⭐", "☄️", "🌠", "🌌", "🌅", "🌄", "🎇", "🎆", "🌇", "🌆", "🏙️", "🌃", "🌉"]
    };

    // Initialize cards based on difficulty
    useEffect(() => {
        if (difficulty && emojiSets[difficulty]) {
            generateCards();
        }
    }, [difficulty]);

    const generateCards = () => {
        const items = emojiSets[difficulty];
        let cardsNeeded;

        switch(difficulty) {
            case 'junior':
                cardsNeeded = 8; // 8 pairs = 16 cards
                break;
            case 'senior':
                cardsNeeded = 16; // 16 pairs = 32 cards
                break;
            case 'expert':
                cardsNeeded = 8; // 8 triples = 24 cards (8 × 3 = 24)
                break;
            default:
                cardsNeeded = 8;
        }

        const initialCards = [];
        const selectedItems = items.slice(0, cardsNeeded);

        for (let i = 0; i < cardsNeeded; i++) {
            if (difficulty === 'expert') {
                // Expert: Add 3 identical cards for each item
                initialCards.push({
                    index: i * 3,
                    item: selectedItems[i],
                    isFlipped: false,
                    isMatched: false
                });
                initialCards.push({
                    index: i * 3 + 1,
                    item: selectedItems[i],
                    isFlipped: false,
                    isMatched: false
                });
                initialCards.push({
                    index: i * 3 + 2,
                    item: selectedItems[i],
                    isFlipped: false,
                    isMatched: false
                });
            } else {
                // Junior & Senior: Add 2 identical cards for each item
                initialCards.push({
                    index: i * 2,
                    item: selectedItems[i],
                    isFlipped: false,
                    isMatched: false
                });
                initialCards.push({
                    index: i * 2 + 1,
                    item: selectedItems[i],
                    isFlipped: false,
                    isMatched: false
                });
            }
        }

        // Shuffle the cards
        for(let i = initialCards.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [initialCards[i], initialCards[j]] = [initialCards[j], initialCards[i]];
        }

        setCards(initialCards);
        setFlippedCards([]);
        setSelectedCards([]);
        setFlipCount(0);
    };

    // Load scores from Firebase with error handling
    useEffect(() => {
        let unsubscribe;

        try {
            const q = query(
                collection(db, 'memoScore'),
                where('difficulty', '==', difficulty),
                orderBy('score', 'desc'),
                limit(10)
            );

            unsubscribe = onSnapshot(q,
                (snapshot) => {
                    const scoresData = [];
                    snapshot.forEach((doc) => {
                        scoresData.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                    setScores(scoresData);
                    setIndexError('');
                },
                (error) => {
                    console.error('Firestore error:', error);

                    if (error.code === 'failed-precondition') {
                        setIndexError(
                            `Index needed for ${difficulty} scores. ` +
                            `Click here to create it: ${error.message.split('create it here: ')[1] || 'Go to Firebase Console > Firestore > Indexes'}`
                        );

                        // Fallback: Load all scores and filter client-side
                        const fallbackQuery = query(
                            collection(db, 'memoScore'),
                            orderBy('score', 'desc'),
                            limit(50)
                        );

                        onSnapshot(fallbackQuery, (fallbackSnapshot) => {
                            const allScores = [];
                            fallbackSnapshot.forEach((doc) => {
                                const data = doc.data();
                                if (data.difficulty === difficulty) {
                                    allScores.push({
                                        id: doc.id,
                                        ...data
                                    });
                                }
                            });
                            allScores.sort((a, b) => b.score - a.score);
                            setScores(allScores.slice(0, 10));
                        });
                    }
                }
            );
        } catch (error) {
            console.error('Error setting up scores listener:', error);
            setIndexError('Failed to load scores. Please check your connection.');
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [difficulty]);

    // Show all cards for different durations based on difficulty
    useEffect(() => {
        if (gameStarted && !gameCompleted) {
            setShowAllCards(true);

            const showDuration = {
                junior: 4000,
                senior: 3000,
                expert: 5000
            };

            const showTimer = setTimeout(() => {
                setShowAllCards(false);
                setCards(prevCards =>
                    prevCards.map(card => ({
                        ...card,
                        isFlipped: false
                    }))
                );
            }, showDuration[difficulty] || 4000);

            return () => clearTimeout(showTimer);
        }
    }, [gameStarted, gameCompleted, difficulty]);

    // Check for matches based on difficulty
    useEffect(() => {
        const checkMatches = () => {
            if (difficulty === 'expert') {
                if (selectedCards.length === 3) {
                    const allSame = selectedCards.every(card =>
                        card.item === selectedCards[0].item
                    );

                    if (allSame) {
                        const newScore = score + 30;
                        setScore(newScore);
                        setNotification(`Triple match! +30 points! Total: ${newScore}`);

                        setCards(prevCards =>
                            prevCards.map(card =>
                                card.item === selectedCards[0].item
                                    ? {...card, isFlipped: true, isMatched: true}
                                    : card
                            )
                        );
                    } else {
                        setNotification("No triple match! Try again.");
                        const newScore = Math.max(0, score - 5);
                        setScore(newScore);

                        setTimeout(() => {
                            setCards(prevCards =>
                                prevCards.map(card =>
                                    selectedCards.some(sc => sc.index === card.index) && !card.isMatched
                                        ? {...card, isFlipped: false}
                                        : card
                                )
                            );
                        }, 1000);
                    }
                    setSelectedCards([]);
                }
            } else {
                if (flippedCards.length === 2) {
                    if (flippedCards[0].item === flippedCards[1].item) {
                        const points = difficulty === 'junior' ? 10 : 15;
                        const newScore = score + points;
                        setScore(newScore);
                        setNotification(`Match found! +${points} points! Total: ${newScore}`);

                        setCards(prevCards =>
                            prevCards.map(card =>
                                card.item === flippedCards[0].item
                                    ? {...card, isFlipped: true, isMatched: true}
                                    : card
                            )
                        );
                    } else {
                        setNotification("No match! Try again.");
                        const penalty = difficulty === 'junior' ? 2 : 3;
                        const newScore = Math.max(0, score - penalty);
                        setScore(newScore);

                        setTimeout(() => {
                            setCards(prevCards =>
                                prevCards.map(card =>
                                    flippedCards.some(fc => fc.index === card.index) && !card.isMatched
                                        ? {...card, isFlipped: false}
                                        : card
                                )
                            );
                        }, 1000);
                    }
                    setFlippedCards([]);
                }
            }
            setFlipCount(0);
        };

        if ((difficulty !== 'expert' && flippedCards.length === 2) ||
            (difficulty === 'expert' && selectedCards.length === 3)) {
            checkMatches();
        }
    }, [flippedCards, selectedCards, difficulty, score]);

    // Check if game is completed
    useEffect(() => {
        if (cards.length > 0 && cards.every(card => card.isMatched) && gameStarted) {
            setGameCompleted(true);
            setNotification(`Congratulations! Game completed! Final Score: ${score}`);
            setShowScoreForm(true);
        }
    }, [cards, gameStarted, score]);

    // NEW: Check if user already exists and get their highest score
    const findExistingUserScore = async (userName, difficulty) => {
        try {
            const q = query(
                collection(db, 'memoScore'),
                where('name', '==', userName.trim()),
                where('difficulty', '==', difficulty)
            );

            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const existingDoc = querySnapshot.docs[0];
                return {
                    exists: true,
                    docId: existingDoc.id,
                    currentHighScore: existingDoc.data().score
                };
            }
            return { exists: false };
        } catch (error) {
            console.error('Error checking existing user:', error);
            return { exists: false };
        }
    };

    const saveScoreToFirebase = async () => {
        if (!userName.trim()) {
            alert('Please enter your name to save your score!');
            return;
        }

        try {
            // Check if user already has a score for this difficulty
            const existingUser = await findExistingUserScore(userName, difficulty);

            if (existingUser.exists) {
                // User exists - only update if new score is higher
                if (score > existingUser.currentHighScore) {
                    await updateDoc(doc(db, 'memoScore', existingUser.docId), {
                        score: score,
                        timestamp: new Date()
                    });
                    setNotification(`New high score! Updated from ${existingUser.currentHighScore} to ${score}`);
                } else {
                    setNotification(`Your current high score (${existingUser.currentHighScore}) is better than this attempt (${score})`);
                }
            } else {
                // New user - create document
                await addDoc(collection(db, 'memoScore'), {
                    name: userName.trim(),
                    score: score,
                    difficulty: difficulty,
                    timestamp: new Date()
                });
                setNotification('Score saved successfully!');
            }

            setShowScoreForm(false);
        } catch (error) {
            console.error('Error saving score:', error);
            setNotification('Error saving score. Please try again.');
        }
    };

    function handleCardClick(cardIndex) {
        if (!gameStarted || gameCompleted || showAllCards) return;

        if (difficulty === 'expert') {
            if (selectedCards.length >= 3) return;
            if (cards[cardIndex].isFlipped || cards[cardIndex].isMatched) return;

            setCards(prevCards =>
                prevCards.map((card, index) =>
                    index === cardIndex ? {...card, isFlipped: true} : card
                )
            );

            setSelectedCards(prev => [...prev, cards[cardIndex]]);
            setFlipCount(prev => prev + 1);
        } else {
            if (flipCount >= 2) return;
            if (cards[cardIndex].isFlipped || cards[cardIndex].isMatched) return;

            setCards(prevCards =>
                prevCards.map((card, index) =>
                    index === cardIndex ? {...card, isFlipped: true} : card
                )
            );

            setFlippedCards(prev => [...prev, cards[cardIndex]]);
            setFlipCount(prev => prev + 1);
        }
    }

    const startGame = () => {
        if (!userName.trim()) {
            alert('Please enter your name to start the game!');
            return;
        }
        setGameStarted(true);
        setGameCompleted(false);
        setScore(0);
        const durationMsg = difficulty === 'senior' ? '3' : difficulty === 'expert' ? '5' : '4';
        setNotification(`Memorize the cards! They will hide in ${durationMsg} seconds...`);
    };

    const resetGame = () => {
        setGameStarted(false);
        setGameCompleted(false);
        setScore(0);
        setFlippedCards([]);
        setSelectedCards([]);
        setFlipCount(0);
        setShowScoreForm(false);
        setNotification('');
        generateCards();
    };

    const handleDifficultyChange = (newDifficulty) => {
        setDifficulty(newDifficulty);
        resetGame();
    };

    // Get grid layout based on difficulty
    const getGridLayout = () => {
        switch(difficulty) {
            case 'junior':
                return 'grid-cols-4 md:grid-cols-4';
            case 'senior':
                return 'grid-cols-4 md:grid-cols-8';
            case 'expert':
                return 'grid-cols-4 md:grid-cols-8 lg:grid-cols-8';
            default:
                return 'grid-cols-4 md:grid-cols-4';
        }
    };

    // Get card size based on difficulty
    const getCardSize = () => {
        switch(difficulty) {
            case 'junior':
                return 'w-16 h-16 lg:w-20 lg:h-20 text-4xl';
            case 'senior':
                return 'w-12 h-12 lg:w-16 lg:h-16 text-3xl';
            case 'expert':
                return 'w-10 h-10 lg:w-12 lg:h-12 text-2xl';
            default:
                return 'w-16 h-16 lg:w-20 lg:h-20 text-4xl';
        }
    };

    // Prepare data for Google Charts - UPDATED for Line Chart
    const chartData = [
        ['Player', 'Score'],
        ...scores.map((score, index) => [`${index + 1}. ${score.name}`, score.score])
    ];

    // UPDATED: Line chart options
    const chartOptions = {
        title: `Top 10 ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level Scores`,
        chartArea: { width: '80%', height: '70%' },
        hAxis: {
            title: 'Player Ranking',
            textStyle: {
                fontSize: 12
            }
        },
        vAxis: {
            title: 'Score',
            minValue: 0,
        },
        legend: { position: 'none' },
        lineWidth: 3,
        pointSize: 6,
        colors: ['#4285F4'],
        curveType: 'function'
    };

    // FIXED: Corrected switch case syntax
    const handleDisplaySelection = (toDisplay) => {
        switch(toDisplay){
            case "info":
                setShowNow({
                    info: true,
                    game: false,
                    stat: false
                });
                break;
            case "game":
                setShowNow({
                    info: false,
                    game: true,
                    stat: false
                });
                break;
            case "stat":
                setShowNow({
                    info: false,
                    game: false,
                    stat: true
                });
                break;
            default:
                break;
        }
    }

    return (
        <div className="container-fluid px-4 py-0 min-w-full min-h-screen">
            <Header headerProps={
                {
                    title: 'Memory Game',
                    navLinks: [
                        {label: 'Schedules', path: '/schedule'},
                        {label: 'Study Plan', path: '/studyPlan'},
                        {label: 'Job Search', path: '/jobSearch'}
                    ]
                }
            } />

            <div className="container-fluid flex flex-col mt-4 bg-gray-100 p-4 md:mt-16">
                <h1 className="text-3xl font-bold mb-4 text-center">Memory Game</h1>

                {/* Index Error Warning */}
                {indexError && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
                        <p className="text-sm">{indexError}</p>
                    </div>
                )}

                {/* Difficulty Selection */}
                <div className="text-center mb-4">
                    <div className="flex justify-center gap-4 mb-4">
                        {['junior', 'senior', 'expert'].map(level => (
                            <button
                                key={level}
                                onClick={() => handleDifficultyChange(level)}
                                className={`px-6 py-2 rounded-lg text-lg font-semibold ${
                                    difficulty === level 
                                        ? level === 'junior' ? 'bg-green-500 text-white' 
                                        : level === 'senior' ? 'bg-blue-500 text-white' 
                                        : 'bg-red-500 text-white'
                                        : 'bg-gray-300 text-gray-700'
                                }`}
                            >
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Difficulty Info */}
                    <div className="text-sm text-gray-600 mb-4">
                        {difficulty === 'junior' && '🎯 8 pairs • 4s preview • +10/-2 points'}
                        {difficulty === 'senior' && '🎯 16 pairs • 3s preview • +15/-3 points'}
                        {difficulty === 'expert' && '🎯 8 triples • 5s preview • Triple matches • +30/-5 points'}
                    </div>

                    {/* User Name Input */}
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-lg mr-2"
                        disabled={gameStarted && !gameCompleted}
                    />
                    {!gameStarted ? (
                        <button
                            onClick={startGame}
                            className="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-lg"
                        >
                            Start Game
                        </button>
                    ) : (
                        <button
                            onClick={resetGame}
                            className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-lg"
                        >
                            Restart Game
                        </button>
                    )}
                </div>

                <p className="text-center text-xl font-semibold mb-2">Score: {score}</p>
                <p className="text-center text-lg mb-4">{notification}</p>

                {/* Selection Info for Expert Mode */}
                {difficulty === 'expert' && gameStarted && !gameCompleted && (
                    <p className="text-center text-sm text-blue-600 mb-2">
                        Selected: {selectedCards.length}/3 - Find triple matches!
                    </p>
                )}

                {/* Save Score Form */}
                {showScoreForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-96">
                            <h3 className="text-2xl font-bold mb-4 text-center">Save Your Score!</h3>
                            <p className="text-center mb-2">Final Score: {score}</p>
                            <p className="text-center mb-4 text-sm text-gray-600">
                                Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </p>
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={saveScoreToFirebase}
                                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Save Score
                                </button>
                                <button
                                    onClick={() => setShowScoreForm(false)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col p-4 lg:flex-row md:flex-row justify-between gap-4">
                    {/* Tab view for small screen - FIXED: Added proper Tailwind classes */}
                    <div className={'lg:hidden md:hidden bg-gray-200 h-12 flex flex-row justify-between rounded mb-4'}>
                        <button
                            onClick={() => handleDisplaySelection("info")}
                            className={`flex-1 ${showNow.info ? 'bg-green-600' : 'bg-green-400'} hover:bg-green-700 text-white px-2 py-2 rounded-l`}
                        >Game Info</button>

                        <button
                            onClick={() => handleDisplaySelection("game")}
                            className={`flex-1 ${showNow.game ? 'bg-yellow-600' : 'bg-yellow-400'} hover:bg-yellow-700 text-white px-2 py-2`}
                        >Game</button>

                        <button
                            onClick={() => handleDisplaySelection("stat")}
                            className={`flex-1 ${showNow.stat ? 'bg-red-600' : 'bg-red-400'} hover:bg-red-700 text-white px-2 py-2 rounded-r`}
                        >Statistics</button>
                    </div>

                    {/* FIXED: Conditional rendering for mobile */}
                    {isMobile ? (
                        <>
                            {showNow.info && (
                                <div className="bg-gray-200 rounded-lg p-3 w-full mb-4">
                                    <h2 className="text-2xl font-bold mb-2">How to Play - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h2>
                                    <ul className="list-disc list-inside mb-4">
                                        {difficulty === 'expert' ? (
                                            <>
                                                <li>Find groups of THREE matching cards</li>
                                                <li>Select 3 cards to check for a match</li>
                                                <li>+30 points for triple matches</li>
                                                <li>-5 points for incorrect selections</li>
                                                <li>8 triples (24 cards) - Most challenging!</li>
                                            </>
                                        ) : (
                                            <>
                                                <li>Find matching pairs of cards</li>
                                                <li>Select 2 cards to check for a match</li>
                                                <li>{difficulty === 'junior' ? '+10 points' : '+15 points'} for matches</li>
                                                <li>{difficulty === 'junior' ? '-2 points' : '-3 points'} for wrong guesses</li>
                                                <li>{difficulty === 'junior' ? '8 pairs' : '16 pairs'}</li>
                                            </>
                                        )}
                                    </ul>

                                    {/* Leaderboard */}
                                    <div className="mt-6">
                                        <h3 className="text-xl font-bold mb-2">
                                            Top {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Scores
                                        </h3>
                                        {scores.length > 0 ? (
                                            <ol className="list-decimal list-inside">
                                                {scores.map((score, index) => (
                                                    <li key={score.id} className="mb-1">
                                                        {score.name}: {score.score} points
                                                    </li>
                                                ))}
                                            </ol>
                                        ) : (
                                            <p>No scores yet. Be the first!</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {showNow.game && (
                                <div className="w-full flex flex-col">
                                    <div className={`grid ${getGridLayout()} gap-2 justify-center mx-auto`}>
                                        {cards.map((card, index) => (
                                            <div
                                                key={index}
                                                className={`${getCardSize()} flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                                                    (showAllCards || card.isFlipped) 
                                                        ? 'bg-white transform rotate-0 border-blue-300' 
                                                        : 'bg-blue-500 text-white border-blue-700'
                                                } ${
                                                    card.isMatched ? 'bg-green-200 border-green-500' : ''
                                                } ${
                                                    selectedCards.some(sc => sc.index === card.index) ? 'ring-2 ring-yellow-400' : ''
                                                }`}
                                                onClick={() => handleCardClick(index)}
                                            >
                                                {(showAllCards || card.isFlipped) ? card.item : '?'}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {showNow.stat && scores.length > 0 && (
                                <div className="w-full bg-white p-4 rounded-lg">
                                    {/* UPDATED: Changed to LineChart */}
                                    <Chart
                                        width={'100%'}
                                        height={'300px'}
                                        chartType="LineChart"
                                        loader={<div>Loading Chart...</div>}
                                        data={chartData}
                                        options={chartOptions}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        /* Desktop layout */
                        <>
                            <div className="bg-gray-200 rounded-lg p-3 lg:w-1/3 md:w-1/3">
                                <h2 className="text-2xl font-bold mb-2">How to Play - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h2>
                                <ul className="list-disc list-inside mb-4">
                                    {difficulty === 'expert' ? (
                                        <>
                                            <li>Find groups of THREE matching cards</li>
                                            <li>Select 3 cards to check for a match</li>
                                            <li>+30 points for triple matches</li>
                                            <li>-5 points for incorrect selections</li>
                                            <li>8 triples (24 cards) - Most challenging!</li>
                                        </>
                                    ) : (
                                        <>
                                            <li>Find matching pairs of cards</li>
                                            <li>Select 2 cards to check for a match</li>
                                            <li>{difficulty === 'junior' ? '+10 points' : '+15 points'} for matches</li>
                                            <li>{difficulty === 'junior' ? '-2 points' : '-3 points'} for wrong guesses</li>
                                            <li>{difficulty === 'junior' ? '8 pairs' : '16 pairs'}</li>
                                        </>
                                    )}
                                </ul>

                                {/* Leaderboard */}
                                <div className="mt-6">
                                    <h3 className="text-xl font-bold mb-2">
                                        Top {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Scores
                                    </h3>
                                    {scores.length > 0 ? (
                                        <ol className="list-decimal list-inside">
                                            {scores.map((score, index) => (
                                                <li key={score.id} className="mb-1">
                                                    {score.name}: {score.score} points
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <p>No scores yet. Be the first!</p>
                                    )}
                                </div>
                            </div>

                            <div className="lg:w-2/3 md:w-2/3 flex flex-col">
                                <div className={`grid ${getGridLayout()} gap-2 justify-center mx-auto`}>
                                    {cards.map((card, index) => (
                                        <div
                                            key={index}
                                            className={`${getCardSize()} flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                                                (showAllCards || card.isFlipped) 
                                                    ? 'bg-white transform rotate-0 border-blue-300' 
                                                    : 'bg-blue-500 text-white border-blue-700'
                                            } ${
                                                card.isMatched ? 'bg-green-200 border-green-500' : ''
                                            } ${
                                                selectedCards.some(sc => sc.index === card.index) ? 'ring-2 ring-yellow-400' : ''
                                            }`}
                                            onClick={() => handleCardClick(index)}
                                        >
                                            {(showAllCards || card.isFlipped) ? card.item : '?'}
                                        </div>
                                    ))}
                                </div>

                                {/* UPDATED: Google Charts Line Graph */}
                                {scores.length > 0 && (
                                    <div className="mt-6 bg-white p-4 rounded-lg">
                                        <Chart
                                            width={'100%'}
                                            height={'300px'}
                                            chartType="LineChart"
                                            loader={<div>Loading Chart...</div>}
                                            data={chartData}
                                            options={chartOptions}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}