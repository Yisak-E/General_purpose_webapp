'use client';

import {useContext , createContext, useState, useEffect, useCallback} from 'react';

 const emojiSet = ['✖️', '🟢', '😊'];




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

    resetGame: () => void;

    winningCombination: number[];

     
};

export const TicContext = createContext<TicContextType | null>(null);

export const TicContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [gameOver , setGameOver] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [board, setBoard] = useState<string[]>(Array(9).fill(emojiSet[2]));
    const [playerTurn, setPlayerTurn] = useState<typeof emojiSet[number]>(emojiSet[0]);
    const [canClick, setCanClick] = useState(true);
    const [winningCombination, setWinningCombination] = useState<number[] | undefined>(undefined);
   
    const aiMoves = useCallback((boardState: string[]) => {
        if (gameOver) {
            return;
        }
        if (playerTurn !== emojiSet[1]) {
            return;
        }
        if (!canClick) {
            const aiMove = best_move(boardState, emojiSet[1]);
            if (aiMove !== null) {
                const updatedBoard = [...boardState];
                updatedBoard[aiMove] = emojiSet[1];
                setBoard(updatedBoard);
                if (check_win(updatedBoard, emojiSet[1])) {
                    setGameOver(true);
                    setWinner(emojiSet[1]);
                    return;
                }
                if (updatedBoard.every(cell => cell !== emojiSet[2])) {
                    setGameOver(true);
                    setWinner(null);
                    return;
                }
            }
            setPlayerTurn(emojiSet[0]);
            setCanClick(true);
        }
    }, [canClick, gameOver, playerTurn]);


    useEffect(() => {
        if (playerTurn === emojiSet[1] && !gameOver) {
            setCanClick(false);
            setTimeout(() => {
                const newBoard = [...board];
                aiMoves(newBoard);
            }, 1000);
        }
    }, [aiMoves, board, gameOver, playerTurn]);

    const check_win = (boardItem: string[], player:string ): boolean => {
    const win_combinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const combination of win_combinations) {
        const [a, b, c] = combination;
        if (boardItem[a] === player && boardItem[b] === player && boardItem[c] === player) {
            setWinningCombination(combination);
            return true;
        }
    }
    return false;
    }

    const handleUserMove = (index: number) => {
        if (board[index] !== emojiSet[2] || gameOver) {
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
        if (board.every(cell => cell !== emojiSet[2])) {
            setGameOver(true);
            setWinner(null);
            return;
        }
        setCanClick(false);
        setPlayerTurn(emojiSet[1]);
    }


    const resetGame = () => {
        setGameOver(false);
        setWinner(null);
        setBoard(Array(9).fill(emojiSet[2]));
        setPlayerTurn(emojiSet[0]);
        setCanClick(true);
    }

    
    const best_move = (boardItem: string[], player: string): number | null => {
        const opponent = player === 'X' ? 'O' : 'X';

        // 1. Win
        for (let i = 0; i < 9; i++) {
            if (boardItem[i] === emojiSet[2]) {
                boardItem[i] = player;
                if (check_win(boardItem, player)) {
                    boardItem[i] = emojiSet[2];
                    return i;
                }
                boardItem[i] = emojiSet[2];
            }
        }

        // 2. Block
        for (let i = 0; i < 9; i++) {
            if (boardItem[i] === emojiSet[2]) {
                boardItem[i] = opponent;
                if (check_win(boardItem, opponent)) {
                    boardItem[i] = emojiSet[2];
                    return i;
                }
                boardItem[i] = emojiSet[2];
            }
        }
        // 3. Center
        if (boardItem[4] === emojiSet[2]) {
            return 4;
        }
        // 4. Corners
        const corners = [0, 2, 6, 8];
        for (const i of corners) {
            if (boardItem[i] === emojiSet[2]) {
                return i;
            }
        }
        // 5. Sides
        const sides = [1, 3, 5, 7];
        for (const i of sides) {
            if (boardItem[i] === emojiSet[2]) {
                return i;
            }
        }
        return null;

    }
   

    return (
        <TicContext.Provider
            value={
               {
                gameOver , setGameOver,
                winner, setWinner,
                board, setBoard,  
                playerTurn, setPlayerTurn
                , handleUserMove,
                resetGame,
                winningCombination: winningCombination || [],

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



//end of file