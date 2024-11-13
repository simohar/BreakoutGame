const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ball properties
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 5;
let dy = -5;
let ballRadius = 10;

// Paddle properties
let paddleHeight = 10;
let paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;

// Control flags
let rightPressed = false;
let leftPressed = false;

// Brick properties
let brickRowCount = 5;
let brickColumnCount = 9;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 15;
let brickOffsetTop = 50;
let brickOffsetLeft = 35;

// Score and lives
let score = 0;
let lives = 3;

// Bricks array
let bricks = [];
for(let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r < brickRowCount; r++) {
        let colorArray = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
        let brickColor = colorArray[r % colorArray.length];
        bricks[c][r] = { x: 0, y: 0, status: 1, color: brickColor };
    }
}

// Event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

// Key handlers
function keyDownHandler(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if(e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if(e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// Collision detection
function collisionDetection() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status === 1) {
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score === brickRowCount * brickColumnCount) {
                        alert('🎉 YOU WIN! Congratulations! 🎉');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Draw functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ecf0f1';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
    ctx.fillStyle = '#ecf0f1';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                b.x = brickX;
                b.y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = b.color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = '20px Verdana';
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('Score: ' + score, 8, 25);
}

function drawLives() {
    ctx.font = '20px Verdana';
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('Lives: ' + lives, canvas.width - 100, 25);
}

// Main draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    // Ball movement logic
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height - ballRadius - 10) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            dx += (Math.random() - 0.5); // Slight angle variation
        } else {
            lives--;
            if(!lives) {
                alert('💀 GAME OVER 💀');
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 5;
                dy = -5;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    // Paddle movement logic
    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

// Start the game
draw();
