// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
} else {
    canvas.width = 1000;
    canvas.height = 700;
}
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameUI = document.getElementById('gameUI');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const bestScoreElement = document.getElementById('bestScore');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

// Game state
let gameState = 'start'; // 'start', 'playing', 'gameOver'
let score = 0;
let bestScore = 0;
let gameStartTime = 0;
let pipeMovementDelay = 1000; // 1 second delay before pipes start moving

// Initialize best score with validation
function initBestScore() {
    const savedBestScore = localStorage.getItem('flappyBirdBest');
    if (savedBestScore !== null && !isNaN(savedBestScore) && savedBestScore >= 0) {
        bestScore = parseInt(savedBestScore, 10);
    }
    bestScoreElement.textContent = bestScore;
}

initBestScore();

// Bird object
const bird = {
    x: 150,
    y: canvas.height / 2,
    width: 35,
    height: 35,
    velocity: 0,
    gravity: 0.3,
    jumpPower: -8,
    color: '#FFD700',
    rotation: 0
};

// Pipes array
let pipes = [];
let pipeWidth = 100;
let pipeGap = 250;
let pipeSpeed = 1.2;

// Mobile detection
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
    pipeSpeed = 2;
    pipeWidth = 80;
    pipeGap = 200;
}

// Background elements
let backgroundOffset = 0;
// Generate varied cloud positions and sizes
const clouds = [];
for (let i = 0; i < 8; i++) {
    clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 2),
        size: 0.8 + Math.random() * 0.7, // Size variation between 0.8 and 1.5
        speed: 0.2 + Math.random() * 0.3  // Speed variation between 0.2 and 0.5
    });
}

// Game functions
function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#98FB98');
    gradient.addColorStop(1, '#228B22');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Moving clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    clouds.forEach(cloud => {
        const x = (cloud.x - backgroundOffset * cloud.speed) % (canvas.width + 100);
        drawCloud(x, cloud.y, cloud.size);
    });
    
    // Ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Ground pattern
    ctx.fillStyle = '#654321';
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillRect(i, canvas.height - 50, 10, 50);
    }
}

function drawCloud(x, y, size = 1) {
    ctx.beginPath();
    ctx.arc(x, y, 15 * size, 0, Math.PI * 2);
    ctx.arc(x + 15 * size, y, 20 * size, 0, Math.PI * 2);
    ctx.arc(x + 35 * size, y, 15 * size, 0, Math.PI * 2);
    ctx.arc(x + 25 * size, y - 10 * size, 15 * size, 0, Math.PI * 2);
    ctx.fill();
}

function drawBird() {
    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    ctx.rotate(bird.rotation);
    
    // Bird body (ellipse)
    ctx.fillStyle = bird.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, bird.width / 2, bird.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird wing
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.ellipse(-bird.width / 4, bird.height / 6, bird.width / 3, bird.height / 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(bird.width / 4, -bird.height / 6, bird.width / 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(bird.width / 4 + bird.width / 12, -bird.height / 6, bird.width / 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird beak
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.moveTo(bird.width / 2, 0);
    ctx.lineTo(bird.width / 2 + bird.width / 3, -bird.height / 6);
    ctx.lineTo(bird.width / 2 + bird.width / 3, bird.height / 6);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

function drawPipe(x, topHeight) {
    // Top pipe
    ctx.fillStyle = '#228B22';
    ctx.fillRect(x, 0, pipeWidth, topHeight);
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(x + 5, 0, pipeWidth - 10, topHeight);
    
    // Top pipe cap
    ctx.fillStyle = '#228B22';
    ctx.fillRect(x - 5, topHeight - 20, pipeWidth + 10, 20);
    
    // Bottom pipe
    const bottomY = topHeight + pipeGap;
    const bottomHeight = canvas.height - bottomY - 50; // Account for ground
    
    ctx.fillStyle = '#228B22';
    ctx.fillRect(x, bottomY, pipeWidth, bottomHeight);
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(x + 5, bottomY, pipeWidth - 10, bottomHeight);
    
    // Bottom pipe cap
    ctx.fillStyle = '#228B22';
    ctx.fillRect(x - 5, bottomY, pipeWidth + 10, 20);
}

function updateBird() {
    if (gameState !== 'playing') return;
    
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    
    // Bird rotation based on velocity
    bird.rotation = Math.min(Math.max(bird.velocity * 0.1, -0.5), 0.5);
    
    // Ground collision
    if (bird.y + bird.height >= canvas.height - 50) {
        gameOver();
    }
    
    // Ceiling collision
    if (bird.y <= 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

function updatePipes() {
    if (gameState !== 'playing') return;
    
    // Check if pipes should start moving yet
    const currentTime = Date.now();
    const shouldMovePipes = currentTime - gameStartTime > pipeMovementDelay;
    
    // Move pipes
    if (shouldMovePipes) {
        pipes.forEach(pipe => {
            pipe.x -= pipeSpeed;
            
            // Score when bird passes pipe
            if (!pipe.scored && pipe.x + pipeWidth < bird.x) {
                score++;
                scoreElement.textContent = score;
                pipe.scored = true;
            }
        });
    }
    
    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
    
    // Add new pipes
    if (shouldMovePipes && (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 400)) {
        const topHeight = Math.random() * (canvas.height - pipeGap - 200 - 50) + 100;
        pipes.push({
            x: canvas.width,
            topHeight: topHeight,
            scored: false
        });
    }
    
    // Check collisions
    pipes.forEach(pipe => {
        if (bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > pipe.topHeight + pipeGap)) {
            gameOver();
        }
    });
}

function jump() {
    if (gameState === 'playing') {
        bird.velocity = bird.jumpPower;
    }
}

function startGame() {
    gameState = 'playing';
    score = 0;
    gameStartTime = Date.now();
    scoreElement.textContent = score;
    
    // Reset bird
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    bird.rotation = 0;
    
    // Clear pipes
    pipes = [];
    
    // Hide start screen, show game UI
    startScreen.classList.add('hidden');
    gameUI.classList.remove('hidden');
    
    gameLoop();
}

function gameOver() {
    gameState = 'gameOver';
    
    // Update best score
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('flappyBirdBest', bestScore);
        bestScoreElement.textContent = bestScore;
    }
    
    finalScoreElement.textContent = score;
    
    // Hide game UI, show game over screen
    gameUI.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
}

function restartGame() {
    gameState = 'start';
    
    // Hide game over screen, show start screen
    gameOverScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

function gameLoop() {
    if (gameState !== 'playing') return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update background offset for parallax effect
    backgroundOffset += 2;
    
    // Draw everything
    drawBackground();
    
    pipes.forEach(pipe => {
        drawPipe(pipe.x, pipe.topHeight);
    });
    
    updateBird();
    updatePipes();
    drawBird();
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'start') {
            startGame();
        } else if (gameState === 'playing') {
            jump();
        } else if (gameState === 'gameOver') {
            restartGame();
        }
    }
});

// Mouse/touch controls
canvas.addEventListener('click', () => {
    if (gameState === 'start') {
        startGame();
    } else if (gameState === 'playing') {
        jump();
    }
});

// Touch controls for mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState === 'start') {
        startGame();
    } else if (gameState === 'playing') {
        jump();
    }
});

// Initial draw
drawBackground();
drawBird();
