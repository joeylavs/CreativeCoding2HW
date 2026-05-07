// -------------------------------
// ASSETS
// -------------------------------
let playerImg, wendigoImg, treeImg, rockImg;

// SOUND FILES
let biteSound, breathingSound, footstepsSound, roarSound;

// -------------------------------
// GAME VARIABLES
// -------------------------------
let player;
let obstacles = [];
let wendigo;
let gameState = "start";
let score = 0;
let highScore = 0;
let baseSpeed = 3;
let obstacleTimer = 0;
let wendigoTimer = 0;

// -------------------------------
// LOAD ASSETS
// -------------------------------
function preload() {
  playerImg = loadImage("assets/player/player.png");
  treeImg = loadImage("assets/images/tree.png");
  rockImg = loadImage("assets/images/rock.png");

  // You haven't added the Wendigo image yet, so skip it for now
  // wendigoImg = loadImage("assets/enemy/wendigo.png");

  biteSound = loadSound("assets/sound/Bite.wav");
  breathingSound = loadSound("assets/sound/Breathing_fast.wav");
  footstepsSound = loadSound("assets/sound/Footsteps_ running.wav");
  roarSound = loadSound("assets/sound/Monster_Roar_2.wav");
}

// -------------------------------
// SETUP
// -------------------------------
function setup() {
  createCanvas(800, 600);

  // PLAYER SPRITE
  player = new Sprite(width / 2, height / 2 + 50, 50, 60);
  player.img = playerImg;
  player.collider = 'none';
  player.rotationLock = true;

  resetGame();

  // FORCE WENDIGO TO APPEAR IN CENTER
  wendigo.active = true;
  wendigo.x = width / 2;
  wendigo.y = height / 2 - 100;
}

// -------------------------------
// RESET GAME
// -------------------------------
function resetGame() {
  // Reset player
  player.x = width / 2;
  player.y = height / 2 + 50;
  player.vel.x = 0;
  player.health = 3;

  // Reset obstacles
  obstacles = [];

  //  FIXED WENDIGO OBJECT
  wendigo = {
    x: width / 2,
    y: -300,
    speed: 1.5,
    active: false
  };

  score = 0;
  baseSpeed = 3;
  obstacleTimer = 0;
  wendigoTimer = 0;

  footstepsSound.stop();
  breathingSound.stop();

  gameState = "start";
}

// -------------------------------
// MAIN DRAW LOOP
// -------------------------------
function draw() {
  background(10, 20, 40);

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "play") {
    updateGame();
    drawGame();
  } else if (gameState === "gameover") {
    drawGame();
    drawGameOver();
  } else if (gameState === "win") {
    drawGame();
    drawWin();
  }
}

// -------------------------------
// INPUT
// -------------------------------
function keyPressed() {
  if (gameState === "start" && key === " ") {
    gameState = "play";
  } else if ((gameState === "gameover" || gameState === "win") && key === " ") {
    resetGame();
  }
}

// -------------------------------
// GAME UPDATE
// -------------------------------
function updateGame() {
  score++;
  baseSpeed += 0.0008;
  obstacleTimer++;
  wendigoTimer++;

  // Normal Wendigo activation
  if (!wendigo.active && wendigoTimer > 600) {
    wendigo.active = true;
    roarSound.setVolume(0.6);
    roarSound.play();
  }

  handleInput();
  updatePlayer();
  spawnObstacles();
  updateObstacles();
  updateWendigo();
  checkCollisions();
}

// -------------------------------
// PLAYER MOVEMENT + FOOTSTEPS
// -------------------------------
function handleInput() {
  let targetVx = 0;

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) targetVx = -5;
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) targetVx = 5;

  player.vel.x = lerp(player.vel.x, targetVx, 0.2);

  if (abs(player.vel.x) > 0.5) {
    if (!footstepsSound.isPlaying()) {
      footstepsSound.setVolume(0.4);
      footstepsSound.loop();
    }
  } else {
    footstepsSound.stop();
  }
}

function updatePlayer() {
  player.x = constrain(player.x, player.width / 2, width - player.width / 2);
}

// -------------------------------
// OBSTACLES
// -------------------------------
function spawnObstacles() {
  if (obstacleTimer > 30) {
    obstacleTimer = 0;

    let x = random(40, width - 40);
    let type = random() < 0.7 ? "tree" : "rock";
    let size = type === "tree" ? 80 : 50;

    obstacles.push({
      x,
      y: -100,
      size,
      type
    });
  }
}

function updateObstacles() {
  for (let o of obstacles) {
    o.y += baseSpeed;
  }
  obstacles = obstacles.filter(o => o.y < height + 100);
}

// -------------------------------
// WENDIGO + BREATHING SOUND
// -------------------------------
function updateWendigo() {
  if (!wendigo.active) return;

  wendigo.y += wendigo.speed;

  let dx = player.x - wendigo.x;
  wendigo.x += dx * 0.02;

  let distToPlayer = dist(player.x, player.y, wendigo.x, wendigo.y);

  if (distToPlayer < 200) {
    if (!breathingSound.isPlaying()) {
      breathingSound.setVolume(0.5);
      breathingSound.loop();
    }
  } else {
    breathingSound.stop();
  }
}

// -------------------------------
// COLLISIONS
// -------------------------------
function checkCollisions() {
  for (let o of obstacles) {
    let d = dist(player.x, player.y, o.x, o.y);

    if (d < o.size / 2 + player.width / 2) {
      player.health--;

      o.y = height + 200;
      wendigo.y += 20;

      if (player.health <= 0) {
        endGame(false);
        return;
      }
    }
  }

  if (wendigo.active) {
    let dW = dist(player.x, player.y, wendigo.x, wendigo.y);
    if (dW < 60) {
      biteSound.setVolume(0.7);
      biteSound.play();
      endGame(false);
      return;
    }
  }

  if (score > 3000) {
    endGame(true);
  }
}

// -------------------------------
// END GAME
// -------------------------------
function endGame(won) {
  if (score > highScore) highScore = score;

  footstepsSound.stop();
  breathingSound.stop();

  gameState = won ? "win" : "gameover";
}

// -------------------------------
// DRAWING
// -------------------------------
function drawGame() {
  drawBackgroundTrees();
  drawObstacles();

  player.draw();   // p5.play sprite

  drawWendigo();   // ⭐ MUST be after player

  drawUI();
}

function drawBackgroundTrees() {
  stroke(40, 80, 60);
  for (let x = 0; x < width; x += 80) {
    line(x + 20, 0, x, height);
  }
  noStroke();
}

function drawObstacles() {
  for (let o of obstacles) {
    if (o.type === "tree") {
      image(treeImg, o.x - o.size / 2, o.y - o.size, o.size, o.size * 1.4);
    } else {
      image(rockImg, o.x - o.size / 2, o.y - o.size / 2, o.size, o.size);
    }
  }
}

//  TEMPORARY WENDIGO SHAPE
function drawWendigo() {
  if (!wendigo.active) return;

  fill(255, 0, 0);
  rect(wendigo.x - 40, wendigo.y - 60, 80, 120);
}

function drawUI() {
  fill(255);
  textSize(18);
  text("Score: " + score, 10, 10);
  text("High: " + highScore, 10, 30);
  text("Health: " + player.health, 10, 50);
}

// -------------------------------
// SCREENS
// -------------------------------
function drawStartScreen() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("WENDIGO RUN", width / 2, height / 2 - 40);
  textSize(20);
  text("Left/Right to move. Survive the chase.", width / 2, height / 2);
  text("Press SPACE to begin", width / 2, height / 2 + 40);
}

function drawGameOver() {
  fill(0, 180);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Caught by the Wendigo", width / 2, height / 2 - 20);
  textSize(20);
  text("Score: " + score, width / 2, height / 2 + 10);
  text("Press SPACE to restart", width / 2, height / 2 + 40);
}

function drawWin() {
  fill(0, 180);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("You Reached the Camp", width / 2, height / 2 - 20);
  textSize(20);
  text("Score: " + score, width / 2, height / 2 + 10);
  text("Press SPACE to restart", width / 2, height / 2 + 40);
}
