'use client';

import { useState, useEffect, useCallback } from 'react';

export default function Page() {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState({ x: 0, y: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [highScore, setHighScore] = useState(0);

    const BOARD_SIZE = 20;

    const generateFood = useCallback(() => {
        const newFood = {
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE),
        };
        return newFood;
    }, []);

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(generateFood());
        setDirection({ x: 0, y: 0 });
        setGameOver(false);
        setScore(0);
        setGameStarted(false);
    };

    const startGame = () => {
        setGameStarted(true);
        setDirection({ x: 1, y: 0 });
    };

    const moveSnake = useCallback(() => {
        if (!gameStarted || gameOver) return;

        setSnake((currentSnake) => {
            const newSnake = [...currentSnake];
            const head = { ...newSnake[0] };

            head.x += direction.x;
            head.y += direction.y;

            // Check wall collision
            if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
                setGameOver(true);
                return currentSnake;
            }

            // Check self collision
            if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
                setGameOver(true);
                return currentSnake;
            }

            newSnake.unshift(head);

            // Check food collision
            if (head.x === food.x && head.y === food.y) {
                setScore((prev) => {
                    const newScore = prev + 10;
                    if (newScore > highScore) {
                        setHighScore(newScore);
                    }
                    return newScore;
                });
                setFood(generateFood());
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    }, [direction, food, gameStarted, gameOver, generateFood, highScore]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!gameStarted && e.key === ' ') {
                startGame();
                return;
            }

            if (gameOver && e.key === ' ') {
                resetGame();
                return;
            }

            switch (e.key) {
                case 'ArrowUp':
                    if (direction.y !== 1) setDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    if (direction.y !== -1) setDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    if (direction.x !== 1) setDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    if (direction.x !== -1) setDirection({ x: 1, y: 0 });
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [direction, gameStarted, gameOver]);

    useEffect(() => {
        const gameInterval = setInterval(moveSnake, 150);
        return () => clearInterval(gameInterval);
    }, [moveSnake]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 flex flex-col items-center justify-center p-4">
            {/* Nokia-style header */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-green-300 mb-2 font-mono tracking-wider">
                    SNAKE XIA
                </h1>
                <p className="text-green-200 text-lg font-mono">Classic Nokia Game Experience</p>
            </div>

            {/* Game container with Nokia-style border */}
            <div className="bg-gray-800 p-6 rounded-lg border-4 border-gray-600 shadow-2xl">
                {/* Score display */}
                <div className="flex justify-between mb-4 text-green-300 font-mono text-lg">
                    <div>Score: {score}</div>
                    <div>High: {highScore}</div>
                </div>

                {/* Game board */}
                <div className="relative bg-black border-2 border-gray-600 p-2">
                    <div
                        className="grid gap-0 bg-green-900"
                        style={{
                            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                            width: '400px',
                            height: '400px',
                        }}
                    >
                        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
                            const x = index % BOARD_SIZE;
                            const y = Math.floor(index / BOARD_SIZE);

                            const isSnake = snake.some(
                                (segment) => segment.x === x && segment.y === y,
                            );
                            const isFood = food.x === x && food.y === y;
                            const isHead = snake[0] && snake[0].x === x && snake[0].y === y;

                            return (
                                <div
                                    key={index}
                                    className={`
                                        w-full h-full border border-green-800
                                        ${isSnake ? (isHead ? 'bg-green-400' : 'bg-green-500') : ''}
                                        ${isFood ? 'bg-red-500' : ''}
                                    `}
                                />
                            );
                        })}
                    </div>

                    {/* Game over overlay */}
                    {gameOver && (
                        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                            <div className="text-center text-green-300 font-mono">
                                <div className="text-2xl mb-2">GAME OVER</div>
                                <div className="text-lg mb-4">Final Score: {score}</div>
                                <div className="text-sm">Press SPACE to restart</div>
                            </div>
                        </div>
                    )}

                    {/* Start screen */}
                    {!gameStarted && !gameOver && (
                        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                            <div className="text-center text-green-300 font-mono">
                                <div className="text-2xl mb-4">SNAKE XIA</div>
                                <div className="text-sm mb-2">Use arrow keys to move</div>
                                <div className="text-sm">Press SPACE to start</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls info */}
                <div className="mt-4 text-center text-green-200 font-mono text-sm">
                    <div className="mb-2">Use ↑ ↓ ← → to control the snake</div>
                    <div>Eat the red food to grow and score points!</div>
                </div>
            </div>

            {/* Mobile controls */}
            <div className="mt-6 grid grid-cols-3 gap-2 md:hidden">
                <div></div>
                <button
                    className="bg-gray-700 text-green-300 p-3 rounded font-mono text-xl"
                    onClick={() => direction.y !== 1 && setDirection({ x: 0, y: -1 })}
                >
                    ↑
                </button>
                <div></div>
                <button
                    className="bg-gray-700 text-green-300 p-3 rounded font-mono text-xl"
                    onClick={() => direction.x !== 1 && setDirection({ x: -1, y: 0 })}
                >
                    ←
                </button>
                <button
                    className="bg-gray-700 text-green-300 p-3 rounded font-mono text-xl"
                    onClick={() => (!gameStarted ? startGame() : gameOver ? resetGame() : null)}
                >
                    {!gameStarted ? 'START' : gameOver ? 'RESET' : '●'}
                </button>
                <button
                    className="bg-gray-700 text-green-300 p-3 rounded font-mono text-xl"
                    onClick={() => direction.x !== -1 && setDirection({ x: 1, y: 0 })}
                >
                    →
                </button>
                <div></div>
                <button
                    className="bg-gray-700 text-green-300 p-3 rounded font-mono text-xl"
                    onClick={() => direction.y !== -1 && setDirection({ x: 0, y: 1 })}
                >
                    ↓
                </button>
                <div></div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-green-200 font-mono text-sm">
                <p>Relive the classic Nokia gaming experience</p>
                <p className="mt-2 text-xs opacity-75">Built with React & Tailwind CSS</p>
            </div>
        </div>
    );
}
