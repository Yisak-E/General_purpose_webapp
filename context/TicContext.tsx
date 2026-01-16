'use client';

import { s } from 'motion/react-m';
import {useContext , createContext, useState, useEffect} from 'react';

 const emojiSet = ['❌', '⭕'];


const check_win = (board: string[], player: string): boolean => {
    const win_combinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const combination of win_combinations) {
        const [a, b, c] = combination;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

type TicContextType = {
    gameOver: boolean;
    setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
    
    winner: string | null;
    setWinner: React.Dispatch<React.SetStateAction<string | null>>;

    board: string[];
    setBoard: React.Dispatch<React.SetStateAction<string[]>>;

    playerTurn: typeof emojiSet[number];
    setPlayerTurn: React.Dispatch<React.SetStateAction<typeof emojiSet[number]>>;

    handleUserMove: (index: number) => void;


     
};

export const TicContext = createContext<TicContextType | null>(null);

export const TicContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [gameOver , setGameOver] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [board, setBoard] = useState<string[]>(Array(9).fill(' '));
    const [playerTurn, setPlayerTurn] = useState<typeof emojiSet[number]>(emojiSet[0]);
    const [canClick, setCanClick] = useState(true);



    useEffect(() => {
        if (playerTurn === emojiSet[1] && !gameOver) {
            setCanClick(false);
            setTimeout(() => {
                const newBoard = [...board];
                aiMoves(newBoard);
                setCanClick(true);
            }, 2000);
        }
    }, [playerTurn, board, gameOver, setCanClick]);

    const handleUserMove = (index: number) => {
        if (board[index] !== ' ' || gameOver) {
            return;
        }
        if (!canClick || playerTurn !== emojiSet[0]) {
            return;
        }
        const newBoard = [...board];
        userMove(index, newBoard);
        setBoard(newBoard);

    }

    const userMove = (index: number, board: string[]) => {
       
        board[index] = emojiSet[0];
        setBoard(board);
        if (check_win(board, emojiSet[0])) {
            setGameOver(true);
            setWinner(emojiSet[0]);
            return;
        }
        if (board.every(cell => cell !== ' ')) {
            setGameOver(true);
            setWinner(null);
            return;
        }
        setPlayerTurn(emojiSet[1]);
    }

    const aiMoves = (board: string[]) => {
         const aiMove = best_move(board, emojiSet[1]);
        if (aiMove !== null) {
            board[aiMove] = emojiSet[1];
            setBoard(board);
            if (check_win(board, emojiSet[1])) {
                setGameOver(true);
                setWinner(emojiSet[1]);
                return;
            }
            if (board.every(cell => cell !== ' ')) {
                setGameOver(true);
                setWinner(null);
                return;
            }
        }
        setPlayerTurn(emojiSet[0]);
    }

   

    return (
        <TicContext.Provider
            value={
               {
                gameOver , setGameOver,
                winner, setWinner,
                board, setBoard,  
                playerTurn, setPlayerTurn
                , handleUserMove

               }
            }>
            {children}
        </TicContext.Provider>
    );
}

export const useTicContext = () => {
    const context = useContext(TicContext);
    if (!context) {
        throw new Error("useTicContext must be used within a TicContextProvider");
    }
    return context;
};



const best_move = (board: string[], player: string): number | null => {
    const opponent = player === 'X' ? 'O' : 'X';

    // 1. Win
    for (let i = 0; i < 9; i++) {
        if (board[i] === ' ') {
            board[i] = player;
            if (check_win(board, player)) {
                board[i] = ' ';
                return i;
            }
            board[i] = ' ';
        }
    }

    // 2. Block
    for (let i = 0; i < 9; i++) {
        if (board[i] === ' ') {
            board[i] = opponent;
            if (check_win(board, opponent)) {
                board[i] = ' ';
                return i;
            }
            board[i] = ' ';
        }
    }
    // 3. Center
    if (board[4] === ' ') {
        return 4;
    }
    // 4. Corners
    const corners = [0, 2, 6, 8];
    for (const i of corners) {
        if (board[i] === ' ') {
            return i;
        }
    }
    // 5. Sides
    const sides = [1, 3, 5, 7];
    for (const i of sides) {
        if (board[i] === ' ') {
            return i;
        }
    }
    return null;

}


/*
 * def best_move(board, player):
    opponent = 'O' if player == 'X' else 'X'

    # 1. Win
    for i in range(9):
        if board[i] == ' ':
            board[i] = player
            if check_win(board, player):
                return i
            board[i] = ' '

    # 2. Block
    for i in range(9):
        if board[i] == ' ':
            board[i] = opponent
            if check_win(board, opponent):
                return i
            board[i] = ' '

    # 3. Center
    if board[4] == ' ':
        return 4

    # 4. Corners
    for i in [0, 2, 6, 8]:
        if board[i] == ' ':
            return i

    # 5. Sides
    for i in [1, 3, 5, 7]:
        if board[i] == ' ':
            return i
 *
 */