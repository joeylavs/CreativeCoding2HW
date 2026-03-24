// ----- GLOBAL STATE -----
let playerX, playerY;
let playerSpeed = 4;

let foodX, foodY;
let isGoodFood = true;

let score = 0;
let health = 3;
let gameTime = 60;   // seconds
let startTime;
let gameOver = false;

// Images
let idleImg;
let moveImg;
let goodFoodImg;
let badFoodImg;

// Sounds
let bgMusic;
let goodSound;
let badSound;

let isMoving = false;

// ----- PRELOAD -----
function preload() {
  idleImg = loadImage('images/idle.png');
  moveImg = loadImage('images/walking.png');

  goodFoodImg = loadImage('images/pizza.png');
  badFoodImg = loadImage('images/broccoli.png');

  bgMusic = loadSound('sounds/background.mp3');
  goodSound = loadSound('sounds/good.wav');
  badSound = loadSound('sounds/bad.wav');
}
function mousePressed() {
  cnv.elt.focus();   // <-- add this
  if (!bgMusic.isPlaying()) {
    bgMusic.loop();
  }
}

// ----- SETUP -----
function setup() {
  let cnv = createCanvas(800, 600);

  // allow keyboard input on GitHub Pages
  cnv.elt.tabIndex = 0;
  cnv.elt.focus();

  playerX = width / 2;
  playerY = height / 2;

  moveFoodRandom();
  randomizeFoodType();

  startTime = millis();
}

// ----- START MUSIC ON CLICK -----
function mousePressed() {
  if (!bgMusic.isPlaying()) {
    bgMusic.loop();
  }
}

// ----- RANDOM FOOD -----
function moveFoodRandom() {
  foodX = random(50, width - 50);
  foodY = random(50, height - 50);
}

function randomizeFoodType() {
  isGoodFood = random() < 0.5; // 50/50 chance
}

// ----- DRAW LOOP -----
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
  text('Health: ' + health, 20, 50);

  // ----- FIXED TIMER LINE -----
  let safeTime = isNaN(remaining) ? 0 : remaining;
  text('Time: ' + safeTime.toFixed(1), 20, 80);

  if (gameOver) {
    textAlign(CENTER, CENTER);
    textSize(48);
    text('GAME OVER', width / 2, height / 2);
  }
}

// ----- MOVEMENT -----
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

// ----- DRAW PLAYER -----
function drawPlayer() {
  imageMode(CENTER);
  if (isMoving) {
    image(moveImg, playerX, playerY, 80, 80);
  } else {
    image(idleImg, playerX, playerY, 80, 80);
  }
}

// ----- DRAW FOOD -----
function drawFood() {
  imageMode(CENTER);
  if (isGoodFood) {
    image(goodFoodImg, foodX, foodY, 64, 64);
  } else {
    image(badFoodImg, foodX, foodY, 64, 64);
  }
}
cnv.elt.tabIndex = 0;
cnv.elt.focus();

// ----- COLLISION -----
function checkCollision() {
  let d = dist(playerX, playerY, foodX, foodY);

  if (d < 40) {
    if (isGoodFood) {
      score++;
      goodSound.play();
    } else {
      health--;
      badSound.play();
      if (health <= 0) gameOver = true;
    }

    moveFoodRandom();
    randomizeFoodType();
  }
}

