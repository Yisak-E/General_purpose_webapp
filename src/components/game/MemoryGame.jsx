import React from 'react';
import Header from "../headers/Header.jsx";

export default function MemoryGame() {
    const [notification, setNotification] = React.useState('');
    const [flipCount, setFlipCount] = React.useState(0);
    const [cards, setCards] = React.useState([]);
    const [flippedCards, setFlippedCards] = React.useState([]);

    // Initialize cards only once on component mount
    React.useEffect(() => {
        const items = ["🐎","🐘", "🦤", "🪰", "🦋", "🪼", "🐦‍🔥", "🐋", "🦏", "🐄"];
        const initialCards = [];

        for (let i = 0; i < 16; i++) {
            initialCards.push({
                index: i,
                item: items[Math.floor(Math.random() * items.length)],
                isFlipped: false
            });
        }

        setCards(initialCards);
    }, []);

    // Check for match when two cards are flipped
    React.useEffect(() => {
        if (flippedCards.length === 2) {
            if (flippedCards[0].item === flippedCards[1].item) {
                setNotification(<span className='text-green-500'>Matched!</span>);

                // Keep matched cards flipped
                setCards(prevCards =>
                    prevCards.map(card =>
                        card.item === flippedCards[0].item ? {...card, isFlipped: true} : card
                    )
                );
            } else {
                setNotification(<span className='text-red-500'>Not Matched!</span>);

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

            <div className="container-fluid flex flex-col mt-4 bg-gray-100">
                <h1 className="text-3xl font-bold mb-4 text-center">Memory Game</h1>
                <p className={'text-center'}> {notification}</p>
               <div className=" flex flex-col p-4">
                    <div className={'bg-gray-200 rounded-lg p-3'}>
                          <h2 className="text-2xl font-bold mb-2">How to Play</h2>
                          <ul className="list-disc list-inside">
                            <li>Click on a card to flip it over and reveal the item.</li>
                            <li>Try to find matching pairs of cards.</li>
                            <li>If the two flipped cards match, they will remain face up.</li>
                            <li>If they do not match, they will flip back over after a short delay.</li>
                            <li>The game continues until all pairs are matched.</li>
                          </ul>
                   </div>
                    <div className="flex flex-row flex-wrap w-full">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className={`w-20 h-20 m-2 flex items-center justify-center text-5xl border rounded-lg cursor-pointer ${card.isFlipped ? 'bg-white' : 'bg-blue-500 text-white'}`}
                                onClick={() => handleCardClick(index)}
                            >
                                {card.isFlipped ? card.item : '❓'}
                            </div>
                        ))}
                    </div>


               </div>
            </div>
        </div>
    );
}