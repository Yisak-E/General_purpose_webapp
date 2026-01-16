import MemoryGame from "./MemoryGame";

export default function Page() {
    const emojiSet = ['😀', '🎉', '🚀', '💧', '🐦‍🔥', '🪼', '🏀' , '🎵', "⭐","🔥"  ];

    return (
        <div className="p-4">
            Game Dashboard Page
            <MemoryGame emojiSet={emojiSet} />
        </div>
    );
}