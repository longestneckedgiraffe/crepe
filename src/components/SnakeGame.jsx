import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 25;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 12, y: 12 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 80;

export default function SnakeGame() {
	const [showText, setShowText] = useState(true);
	const [gameActive, setGameActive] = useState(false);
	const [snake, setSnake] = useState(INITIAL_SNAKE);
	const [direction, setDirection] = useState(INITIAL_DIRECTION);
	const [apple, setApple] = useState({ x: 15, y: 15 });
	const inputQueue = useRef([]);

	const generateApple = useCallback((currentSnake) => {
		let newApple;
		do {
			newApple = {
				x: Math.floor(Math.random() * GRID_SIZE),
				y: Math.floor(Math.random() * GRID_SIZE)
			};
		} while (currentSnake.some(segment => segment.x === newApple.x && segment.y === newApple.y));
		return newApple;
	}, []);

	const handleStartGame = () => {
		setShowText(false);
		setTimeout(() => {
			setGameActive(true);
			setSnake(INITIAL_SNAKE);
			setDirection(INITIAL_DIRECTION);
			inputQueue.current = [];
			setApple(generateApple(INITIAL_SNAKE));
		}, 400);
	};

	const handleGameOver = useCallback(() => {
		setGameActive(false);
		setTimeout(() => {
			setShowText(true);
		}, 400);
	}, []);

	useEffect(() => {
		if (!gameActive) return;

		const handleKeyPress = (e) => {
			const key = e.key.toLowerCase();
			const lastDirection = inputQueue.current.length > 0
				? inputQueue.current[inputQueue.current.length - 1]
				: direction;

			let newDirection = null;

			if ((key === 'arrowup' || key === 'w') && lastDirection.y === 0) {
				newDirection = { x: 0, y: -1 };
			} else if ((key === 'arrowdown' || key === 's') && lastDirection.y === 0) {
				newDirection = { x: 0, y: 1 };
			} else if ((key === 'arrowleft' || key === 'a') && lastDirection.x === 0) {
				newDirection = { x: -1, y: 0 };
			} else if ((key === 'arrowright' || key === 'd') && lastDirection.x === 0) {
				newDirection = { x: 1, y: 0 };
			}

			if (newDirection && inputQueue.current.length < 3) {
				inputQueue.current.push(newDirection);
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [gameActive, direction]);

	useEffect(() => {
		if (!gameActive) return;

		const gameLoop = setInterval(() => {
			setDirection(currentDirection => {
				const nextDirection = inputQueue.current.length > 0
					? inputQueue.current.shift()
					: currentDirection;

				setSnake(prevSnake => {
					const head = prevSnake[0];
					const newHead = {
						x: head.x + nextDirection.x,
						y: head.y + nextDirection.y
					};

					if (
						newHead.x < 0 || newHead.x >= GRID_SIZE ||
						newHead.y < 0 || newHead.y >= GRID_SIZE ||
						prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
					) {
						handleGameOver();
						return prevSnake;
					}

					const newSnake = [newHead, ...prevSnake];

					if (newHead.x === apple.x && newHead.y === apple.y) {
						setApple(generateApple(newSnake));
						return newSnake;
					}

					newSnake.pop();
					return newSnake;
				});

				return nextDirection;
			});
		}, GAME_SPEED);

		return () => clearInterval(gameLoop);
	}, [gameActive, apple, generateApple, handleGameOver]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-white relative">
			<div
				className="text-center transition-opacity duration-300"
				style={{
					position: 'absolute',
					opacity: showText ? 1 : 0,
					pointerEvents: showText ? 'auto' : 'none'
				}}
			>
				<h1 className="text-4xl md:text-5xl font-thin tracking-tight text-gray-900 mb-4">
					This is under construction
				</h1>
				<a
					href="mailto:contact@ridhwanzaman.me"
					className="text-lg md:text-xl font-thin tracking-tight text-gray-600 hover:text-gray-400 transition-colors duration-300"
				>
					contact@ridhwanzaman.me
				</a>
			</div>

			<button
				onClick={handleStartGame}
				className="absolute w-12 h-12 bg-green-600 hover:bg-green-500 transition-all duration-300"
				style={{
					marginTop: '180px',
					opacity: showText && !gameActive ? 1 : 0,
					pointerEvents: showText && !gameActive ? 'auto' : 'none',
					outline: 'none'
				}}
				aria-label="Start Snake Game"
			/>

			<div
				className="transition-opacity duration-300"
				style={{
					opacity: gameActive ? 1 : 0,
					width: GRID_SIZE * CELL_SIZE,
					height: GRID_SIZE * CELL_SIZE,
					position: 'relative',
					display: 'grid',
					gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
					gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
					pointerEvents: gameActive ? 'auto' : 'none',
					border: '1px solid #e5e7eb'
				}}
			>
				{Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
					const x = index % GRID_SIZE;
					const y = Math.floor(index / GRID_SIZE);
					const isSnake = snake.some(segment => segment.x === x && segment.y === y);
					const isApple = apple.x === x && apple.y === y;

					return (
						<div
							key={index}
							style={{
								width: CELL_SIZE,
								height: CELL_SIZE,
								backgroundColor: isSnake ? '#16a34a' : isApple ? '#dc2626' : 'transparent',
							}}
						/>
					);
				})}
			</div>

			<div className="absolute bottom-6 left-0 right-0 text-center">
				<p className="text-xs font-thin tracking-tight text-gray-400">
					© 2025 Ridhwan Zaman
				</p>
			</div>
		</div>
	);
}
