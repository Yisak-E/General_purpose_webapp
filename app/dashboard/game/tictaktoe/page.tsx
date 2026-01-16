import TikClient from "./TikClient";

export default function Page() {
    return (
        <div>
            Tic Tac Toe Game Page
            <TikClient emojiSet={['❌', '⭕']} />
        </div>
    );
}