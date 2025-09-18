import React, {useState, useEffect} from 'react';
import Header from "../headers/Header.jsx";

export default function MemoryGame() {
    const [notification, setNotification] = useState('');
    const [flipCount, setFlipCount] = useState(0);
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [score, setScore] = useState(0);



    // Initialize cards only once on component mount
    useEffect(() => {
        const items = ["🐎","🐘", "🦤", "🪰", "🦋", "🪼", "🐦‍🔥", "🐋", "🦏", "🐄"];

        const initialCards = [];

        for (let i = 0; i < 8; i++) {
            initialCards.push({
                index: i,
                item: items[i],
                isFlipped: false
            });
              initialCards.push({
                index: i+8,
                item: items[i],
                isFlipped: false
            });
        }

        for(let i = initialCards.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [initialCards[i], initialCards[j]] = [initialCards[j], initialCards[i]];
        }

        setCards(initialCards);
    }, []);

    // Check for match when two cards are flipped
    useEffect(() => {
        if (flippedCards.length === 2) {
            if (flippedCards[0].item === flippedCards[1].item) {
                setScore((prev) => (Math.pow(prev, 2) +1))
                setNotification(`Your score: ${score}`);

                // Keep matched cards flipped
                setCards(prevCards =>
                    prevCards.map(card =>
                        card.item === flippedCards[0].item ? {...card, isFlipped: true} : card
                    )
                );
            } else {
                setNotification("");
                setScore((prev) =>(
                    prev >= 3*prev?
                        prev-3*prev : prev-1
                ));

                // Flip unmatched cards back after a delay
                setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map(card =>
                            flippedCards.some(fc => fc.index === card.index)
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

    function handleCardClick(cardIndex) {
        // Don't allow more than 2 cards to be flipped at once
        if (flipCount >= 2) return;

        // Don't allow already flipped cards to be clicked again
        if (cards[cardIndex].isFlipped) return;

        setCards(prevCards =>
            prevCards.map((card, index) =>
                index === cardIndex ? {...card, isFlipped: true} : card
            )
        );

        setFlippedCards(prev => [...prev, cards[cardIndex]]);
        setFlipCount(prev => prev + 1);
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

            <div className="container-fluid flex flex-col mt-4 bg-gray-100 ">
                <h1 className="text-3xl font-bold mb-4 text-center">Memory Game</h1>
                <p className={'text-center'}> {notification}</p>
               <div className=" flex flex-col p-4 lg:flex-row md:flex-row  justify-between gap-4">
                    <div className={'bg-gray-200 rounded-lg p-3 md:w-160'}>
                          <h2 className="text-2xl font-bold mb-2">How to Play</h2>
                          <ul className="list-disc list-inside">
                            <li>Click on a card to flip it over and reveal the item.</li>
                            <li>Try to find matching pairs of cards.</li>
                            <li>If the two flipped cards match, they will remain face up.</li>
                            <li>If they do not match, they will flip back over after a short delay.</li>
                            <li>The game continues until all pairs are matched.</li>
                          </ul>
                   </div>
                   <div className={' lg:w-300 md:w-400 flex flex-col'}>
                        <div className="flex flex-row flex-wrap w-sm lg:p-5 lg:mx-auto md:w-120 lg:w-150 md:p-2 md:mx-auto">
                            {cards.map((card, index) => (
                                <div
                                    key={index}
                                    className={`w-20 h-20 m-2 flex items-center justify-center text-5xl border rounded-lg cursor-pointer lg:w-27 ${card.isFlipped ? 'bg-white' : 'bg-blue-500 text-white'}`}
                                    onClick={() => handleCardClick(index)}
                                >
                                    {card.isFlipped ? card.item : '❓'}
                                </div>
                            ))}
                        </div>

                    </div>
               </div>
            </div>
        </div>
    );
}