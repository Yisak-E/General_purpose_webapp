import React, {useState, useEffect} from 'react';
import Header from "../headers/Header.jsx";
import { db } from '../../api/firebaseConfigs.js';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit
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

    // Initialize cards only once on component mount
    useEffect(() => {
        const items = ["🐎","🐘", "🦤", "🪰", "🦋", "🪼", "🐦‍🔥", "🐋", "🦏", "🐄"];

        const initialCards = [];

        for (let i = 0; i < 8; i++) {
            initialCards.push({
                index: i,
                item: items[i],
                isFlipped: false,
                isMatched: false
            });
            initialCards.push({
                index: i+8,
                item: items[i],
                isFlipped: false,
                isMatched: false
            });
        }

        for(let i = initialCards.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [initialCards[i], initialCards[j]] = [initialCards[j], initialCards[i]];
        }

        setCards(initialCards);
    }, []);

    // Load top scores from Firebase
    useEffect(() => {
        const q = query(
            collection(db, 'memoScore'),
            orderBy('score', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const scoresData = [];
            snapshot.forEach((doc) => {
                scoresData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setScores(scoresData);
        });

        return () => unsubscribe();
    }, []);

    // Show all cards for 4 seconds when game starts
    useEffect(() => {
        if (gameStarted && !gameCompleted) {
            setShowAllCards(true);

            // Show all cards for 4 seconds
            const showTimer = setTimeout(() => {
                setShowAllCards(false);
                setCards(prevCards =>
                    prevCards.map(card => ({
                        ...card,
                        isFlipped: false
                    }))
                );
            }, 4000);

            return () => clearTimeout(showTimer);
        }
    }, [gameStarted, gameCompleted]);

    // Check for match when two cards are flipped
    useEffect(() => {
        if (flippedCards.length === 2) {
            if (flippedCards[0].item === flippedCards[1].item) {
                const newScore = score + 10;
                setScore(newScore);
                setNotification(`Match found! +10 points! Total: ${newScore}`);

                // Mark matched cards
                setCards(prevCards =>
                    prevCards.map(card =>
                        card.item === flippedCards[0].item
                            ? {...card, isFlipped: true, isMatched: true}
                            : card
                    )
                );
            } else {
                setNotification("No match! Try again.");
                const newScore = Math.max(0, score - 2);
                setScore(newScore);

                // Flip unmatched cards back after a delay
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

            // Reset flipped cards after checking
            setFlippedCards([]);
            setFlipCount(0);
        }
    }, [flippedCards]);

    // Check if game is completed
    useEffect(() => {
        if (cards.length > 0 && cards.every(card => card.isMatched) && gameStarted) {
            setGameCompleted(true);
            setNotification(`Congratulations! Game completed! Final Score: ${score}`);
            setShowScoreForm(true);
        }
    }, [cards, gameStarted]);

    const saveScoreToFirebase = async () => {
        if (!userName.trim()) {
            alert('Please enter your name to save your score!');
            return;
        }

        try {
            await addDoc(collection(db, 'memoScore'), {
                name: userName.trim(),
                score: score,
                timestamp: new Date()
            });
            setNotification('Score saved successfully!');
            setShowScoreForm(false);
        } catch (error) {
            console.error('Error saving score:', error);
            setNotification('Error saving score. Please try again.');
        }
    };

    function handleCardClick(cardIndex) {
        if (!gameStarted || gameCompleted || showAllCards) return;

        // Don't allow more than 2 cards to be flipped at once
        if (flipCount >= 2) return;

        // Don't allow already flipped or matched cards to be clicked again
        if (cards[cardIndex].isFlipped || cards[cardIndex].isMatched) return;

        setCards(prevCards =>
            prevCards.map((card, index) =>
                index === cardIndex ? {...card, isFlipped: true} : card
            )
        );

        setFlippedCards(prev => [...prev, cards[cardIndex]]);
        setFlipCount(prev => prev + 1);
    }

    const startGame = () => {
        if (!userName.trim()) {
            alert('Please enter your name to start the game!');
            return;
        }
        setGameStarted(true);
        setGameCompleted(false);
        setScore(0);
        setNotification('Memorize the cards! They will hide in 4 seconds...');
    };

    const resetGame = () => {
        setGameStarted(false);
        setGameCompleted(false);
        setScore(0);
        setFlippedCards([]);
        setFlipCount(0);
        setShowScoreForm(false);
        setNotification('');

        // Reset cards
        setCards(prevCards =>
            prevCards.map(card => ({
                ...card,
                isFlipped: false,
                isMatched: false
            }))
        );
    };

    // Prepare data for Google Charts
    const chartData = [
        ['Player', 'Score'],
        ...scores.map(score => [score.name, score.score])
    ];

    const chartOptions = {
        title: 'Top 10 Memory Game Scores',
        chartArea: { width: '80%' },
        hAxis: {
            title: 'Score',
            minValue: 0,
        },
        vAxis: {
            title: 'Player',
        },
        bars: 'horizontal',
        colors: ['#4285F4']
    };

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

            <div className="container-fluid flex flex-col mt-4 bg-gray-100 p-4">
                <h1 className="text-3xl font-bold mb-4 text-center">Memory Game</h1>

                {/* User Name Input */}
                <div className="text-center mb-4">
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

                {/* Save Score Form */}
                {showScoreForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-96">
                            <h3 className="text-2xl font-bold mb-4 text-center">Save Your Score!</h3>
                            <p className="text-center mb-4">Final Score: {score}</p>
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
                    <div className="bg-gray-200 rounded-lg p-3 md:w-160">
                        <h2 className="text-2xl font-bold mb-2">How to Play</h2>
                        <ul className="list-disc list-inside">
                            <li>Enter your name and click Start Game</li>
                            <li>Memorize the cards shown for 4 seconds</li>
                            <li>Click on cards to flip them and find matching pairs</li>
                            <li>+10 points for each match, -2 points for wrong guesses</li>
                            <li>Save your score to compete with others!</li>
                        </ul>

                        {/* Leaderboard */}
                        <div className="mt-6">
                            <h3 className="text-xl font-bold mb-2">Top Scores</h3>
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

                    <div className="lg:w-300 md:w-400 flex flex-col">
                        <div className="flex flex-row flex-wrap w-sm lg:p-5 lg:mx-auto md:w-120 lg:w-150 md:p-2 md:mx-auto justify-center">
                            {cards.map((card, index) => (
                                <div
                                    key={index}
                                    className={`w-20 h-20 m-2 flex items-center justify-center text-5xl border rounded-lg cursor-pointer lg:w-27 transition-all duration-300 ${
                                        (showAllCards || card.isFlipped) 
                                            ? 'bg-white transform rotate-0' 
                                            : 'bg-blue-500 text-white transform rotate-y-180'
                                    } ${
                                        card.isMatched ? 'bg-green-200 border-green-500' : ''
                                    }`}
                                    onClick={() => handleCardClick(index)}
                                >
                                    {(showAllCards || card.isFlipped) ? card.item : '❓'}
                                </div>
                            ))}
                        </div>

                        {/* Google Charts Graph */}
                        {scores.length > 0 && (
                            <div className="mt-6 bg-white p-4 rounded-lg">
                                <Chart
                                    width={'100%'}
                                    height={'300px'}
                                    chartType="BarChart"
                                    loader={<div>Loading Chart...</div>}
                                    data={chartData}
                                    options={chartOptions}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}