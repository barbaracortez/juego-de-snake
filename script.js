// HTML ELEMENTS
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

// Game setting
const boardSize = 10;
const gameSpeed = 100;
const squareType = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};

const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1, // Corrected typo: ArrowRigth -> ArrowRight
    ArrowLeft: -1
};

// Game Variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
};

// Set direction of the snake
const setDirection = newDirection => {
    direction = directions[newDirection];
};

// Move the snake
const moveSnake = () => {
    const newSquare = String(Number(snake[snake.length - 1]) + direction).padStart(2, '0');
    const [row, column] = newSquare.split('').map(Number);

    if (
        newSquare < 0 ||
        newSquare >= boardSize * boardSize ||
        (direction === directions.ArrowRight && column === 0) ||
        (direction === directions.ArrowLeft && column === 9) ||
        boardSquares[row][column] === squareType.snakeSquare
    ) {
        gameOver();
    } else {
        snake.push(newSquare);
        if (boardSquares[row][column] === squareType.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
};

// Add food to the board
const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
};

// Handle game over
const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval);
    startButton.disabled = false;
};

// Handle direction change event
const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction !== directions.ArrowDown && setDirection(key.code);
            break;
        case 'ArrowDown':
            direction !== directions.ArrowUp && setDirection(key.code);
            break;
        case 'ArrowLeft':
            direction !== directions.ArrowRight && setDirection(key.code);
            break;
        case 'ArrowRight':
            direction !== directions.ArrowLeft && setDirection(key.code);
            break;
    }
};

// Draw square on the board
const drawSquare = (square, type) => {
    const [row, column] = square.split('').map(Number);
    boardSquares[row][column] = squareType[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        const emptySquareIndex = emptySquares.indexOf(square);
        if (emptySquareIndex !== -1) {
            emptySquares.splice(emptySquareIndex, 1);
        }
    }
};

// Update score on the scoreboard
const updateScore = () => {
    scoreBoard.innerText = score;
};

// Create random food on the board
const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
};

// Create the game board
const createBoard = () => {
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareType.emptySquare));
    board.innerHTML = '';
    emptySquares = [];
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((_, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        });
    });
};

// Set initial game state
const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length;
    direction = directions.ArrowRight; // Corrected typo: ArrowRigth -> ArrowRight
    createBoard();
    drawSnake();
    updateScore();
    createRandomFood();
};

// Start the game
const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval(moveSnake, gameSpeed);
};

startButton.addEventListener('click', startGame);
