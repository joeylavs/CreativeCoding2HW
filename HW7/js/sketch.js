// ----- GLOBAL STATE -----
let playerX, playerY;
let playerSpeed = 4;

let foodX, foodY;

let score = 0;
let gameTime = 60;   // seconds
let startTime;
let gameOver = false;

let idleImg;
let moveImg;
let foodImg;

let isMoving = false;

function preload() {
  idleImg = loadImage('images/player_idle.png');
  moveImg = loadImage('images/player_move.png');
  foodImg = loadImage('images/food.png');
}

function setup() {
  createCanvas(800, 600);

  playerX = width / 2;
  playerY = height / 2;

  moveFoodRandom();

  startTime = millis();
}
function moveFoodRandom() {
  foodX = random(50, width - 50);
  foodY = random(50, height - 50);
}
function draw() {
  background(50);

  // TIMER
  let elapsed = (millis() - startTime) / 1000;
  let remaining = max(0, gameTime - elapsed);

  if (remaining <= 0 && !gameOver) {
    gameOver = true;
  }

  // UPDATE ONLY IF GAME IS RUNNING
  if (!gameOver) {
    handleMovement();
    checkCollision();
  }

  // DRAW OBJECTS
  drawFood();
  drawPlayer();

  // UI
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 20, 20);
  text('Time: ' + nf(remaining.toFixed(1), 2, 1), 20, 50);

  if (gameOver) {
    textAlign(CENTER, CENTER);
    textSize(48);
    text('GAME OVER', width / 2, height / 2);
  }
}
function handleMovement() {
  let movingNow = false;

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // A
    playerX -= playerSpeed;
    movingNow = true;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // D
    playerX += playerSpeed;
    movingNow = true;
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // W
    playerY -= playerSpeed;
    movingNow = true;
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // S
    playerY += playerSpeed;
    movingNow = true;
  }

  // keep inside canvas
  playerX = constrain(playerX, 0, width);
  playerY = constrain(playerY, 0, height);

  isMoving = movingNow;
}
function drawPlayer() {
  imageMode(CENTER);
  if (isMoving) {
    image(moveImg, playerX, playerY, 80, 80);
  } else {
    image(idleImg, playerX, playerY, 80, 80);
  }
}
function drawFood() {
  imageMode(CENTER);
  image(foodImg, foodX, foodY, 64, 64);
}

function checkCollision() {
  let d = dist(playerX, playerY, foodX, foodY);
  let collisionRadius = 40; // tweak for your art

  if (d < collisionRadius) {
    score++;
    moveFoodRandom();
  }
}
