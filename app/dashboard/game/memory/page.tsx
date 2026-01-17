import MemoryGame from "./MemoryGame";

export default function Page() {
    const emojiSet = ['😀', '🎉', '🚀', '💧', '🐦‍🔥', '🪼', '🏀' , '🎵', "⭐","🔥"  ];

    return (
        <div className="p-4">
            <MemoryGame emojiSet={emojiSet} />
        </div>
    );
}