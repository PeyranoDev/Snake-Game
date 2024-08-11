const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.querySelector('.startButton');
const restartButton = document.querySelector('.restartButton');
const lostMessage = document.querySelector('.lostMessage');
const difficultyOptions = document.querySelectorAll('.difficultyOption');

// Ajustes para el tamaño del canvas y de las celdas
const cellSize = 20;  // Tamaño de cada celda de la serpiente y la comida
const canvasSize = 400;  // Tamaño del canvas

canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [];
let food = { x: 15, y: 15 };
let dx = 1; // Movimiento inicial hacia la derecha
let dy = 0;
let score = 0;
let gameInterval;
let gameSpeed;  // Definición global de gameSpeed

function initSnake() {
    snake = [
        { x: 7, y: 5 },
        { x: 7, y: 5 },
        { x: 7, y: 5 }
    ];
}

let selectedDifficulty = 'easy';  

difficultyOptions.forEach(option => {
    option.addEventListener('click', function() {
        // Eliminar la clase 'active' de todos los divs
        difficultyOptions.forEach(opt => opt.classList.remove('active'));

        // Añadir la clase 'active' al div clicado
        this.classList.add('active');

        // Cambiar la dificultad según la opción seleccionada
        selectedDifficulty = this.getAttribute('data-difficulty');
        console.log('Dificultad seleccionada:', selectedDifficulty);

        // Aquí puedes actualizar la velocidad del juego según la dificultad seleccionada
        if (selectedDifficulty === 'easy') {
            gameSpeed = 200;
        } else if (selectedDifficulty === 'medium') {
            gameSpeed = 150;
        }
        else if (selectedDifficulty === 'hard') {
            gameSpeed = 100;
        }
        else if (selectedDifficulty === 'insane') {
            gameSpeed = 50;
        }
    });
});

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = 'green';
        ctx.fillRect(part.x * cellSize, part.y * cellSize, cellSize, cellSize);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        createFood();
        eatSound.play();
    } else {
        snake.pop();
    }
}

function createFood() {
    food.x = Math.floor(Math.random() * (canvasSize / cellSize));
    food.y = Math.floor(Math.random() * (canvasSize / cellSize));
}

function checkCollision() {
    const head = snake[0];
    const hitWall = head.x < 0 || head.x >= (canvasSize / cellSize) || head.y < 0 || head.y >= (canvasSize / cellSize);
    const hitSelf = snake.slice(1).some(part => part.x === head.x && part.y === head.y);
    return hitWall || hitSelf;
}

function resetGame() {
    initSnake();
    dx = 1;  
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    createFood();
    lostMessage.style.display = 'none';
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    gameSpeed;  // Asignar la velocidad según la dificultad
}

function startGame() {
    resetGame();
    backgroundMusic.play();
    clearInterval(gameInterval);  // Limpiar cualquier intervalo previo
    gameInterval = setInterval(() => {
        moveSnake();
        if (checkCollision()) {
            endGame();
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawFood();
            drawSnake();
        }
    }, gameSpeed);
}

function endGame() {
    clearInterval(gameInterval);
    backgroundMusic.pause(); 
    backgroundMusic.currentTime = 0; 
    lostMessage.style.display = 'block';
    restartButton.style.display = 'inline-block';
}

document.addEventListener('keydown', event => {
    const keyPressed = event.key;
    if (keyPressed === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -1;
        moveSound.play();
    } else if (keyPressed === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = 1;
        moveSound.play();
    } else if (keyPressed === 'ArrowLeft' && dx === 0) {
        dx = -1;
        dy = 0;
        moveSound.play();
    } else if (keyPressed === 'ArrowRight' && dx === 0) {
        dx = 1;
        dy = 0;
        moveSound.play();
    }
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
startButton.style.display = 'inline-block';
