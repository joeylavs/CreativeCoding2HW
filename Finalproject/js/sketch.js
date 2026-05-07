// -------------------------------------
// ASSETS
// -------------------------------------
let biteSound, breathingSound, footstepsSound, roarSound;

// -------------------------------------
// GAME VARIABLES
// -------------------------------------
let player;
let wendigo;
let obstacles;
let gameState = "start";
let score = 0;
let highScore = 0;
let baseSpeed = 3;
let obstacleTimer = 0;
let wendigoTimer = 0;

// -------------------------------------
// LOAD ASSETS
// -------------------------------------
function preload() {
  biteSound = loadSound("assets/sound/Bite.wav");
  breathingSound = loadSound("assets/sound/Breathing_fast.wav");
  footstepsSound = loadSound("assets/sound/Footsteps_ running.wav");
  roarSound = loadSound("assets/sound/Monster_Roar_2.wav");
}

// -------------------------------------
// SETUP
// -------------------------------------
function setup() {
  new Canvas(800, 600);
  world.gravity.y = 0;

  obstacles = new Group();

  resetGame();
}

// -------------------------------------
// RESET GAME
// -------------------------------------
function resetGame() {
  score = 0;
  baseSpeed = 3;
  obstacleTimer = 0;
  wendigoTimer = 0;

  obstacles.removeAll();

  // PLAYER SPRITE
  player = new Sprite(width / 2, height - 120, 50, 60, "k");
  player.color = "white";
  player.health = 3;

  // WENDIGO SPRITE
  wendigo = new Sprite(width / 2, -300, 80, 120, "k");
  wendigo.color = "red";
  wendigo.active = false;
  wendigo.speed = 1.5;

  footstepsSound.stop();
  breathingSound.stop();

  gameState = "start";
}

// -------------------------------------
// MAIN DRAW LOOP
// -------------------------------------
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

// -------------------------------------
// INPUT
// -------------------------------------
function keyPressed() {
  if (gameState === "start" && key === " ") {
    gameState = "play";
  } else if ((gameState === "gameover" || gameState === "win") && key === " ") {
    resetGame();
  }
}

// -------------------------------------
// GAME UPDATE
// -------------------------------------
function updateGame() {
  score++;
  baseSpeed += 0.0008;
  obstacleTimer++;
  wendigoTimer++;

  // WENDIGO APPEARS
  if (!wendigo.active && wendigoTimer > 600) {
    wendigo.active = true;
    roarSound.setVolume(0.6);
    roarSound.play();
  }

  handleInput();
  updateWendigo();
  spawnObstacles();
  checkCollisions();
}

// -------------------------------------
// PLAYER MOVEMENT + FOOTSTEPS
// -------------------------------------
function handleInput() {
  player.vel.x = 0;

  if (kb.pressing("left") || kb.pressing("a")) player.vel.x = -5;
  if (kb.pressing("right") || kb.pressing("d")) player.vel.x = 5;

  // FOOTSTEPS SOUND
  if (abs(player.vel.x) > 0.5) {
    if (!footstepsSound.isPlaying()) {
      footstepsSound.setVolume(0.4);
      footstepsSound.loop();
    }
  } else {
    footstepsSound.stop();
  }
}

// -------------------------------------
// OBSTACLES
// -------------------------------------
function spawnObstacles() {
  if (obstacleTimer > 30) {
    obstacleTimer = 0;

    let o = new obstacles.Sprite(random(40, width - 40), -100, 50, 50, "k");
    o.color = random() < 0.7 ? "green" : "gray";
    o.type = o.color === "green" ? "tree" : "rock";
    o.vel.y = baseSpeed;
  }

  // Remove off-screen
  obstacles.forEach(o => {
    if (o.y > height + 100) o.remove();
  });
}

// -------------------------------------
// WENDIGO + BREATHING SOUND
// -------------------------------------
function updateWendigo() {
  if (!wendigo.active) return;

  wendigo.vel.y = wendigo.speed;

  // Chase player
  let dx = player.x - wendigo.x;
  wendigo.vel.x = dx * 0.02;

  // BREATHING WHEN CLOSE
  let d = dist(player.x, player.y, wendigo.x, wendigo.y);

  if (d < 200) {
    if (!breathingSound.isPlaying()) {
      breathingSound.setVolume(0.5);
      breathingSound.loop();
    }
  } else {
    breathingSound.stop();
  }
}

// -------------------------------------
// COLLISIONS
// -------------------------------------
function checkCollisions() {
  // OBSTACLES
  player.overlaps(obstacles, (p, o) => {
    player.health--;
    o.remove();
    wendigo.y += 20;

    if (player.health <= 0) {
      endGame(false);
    }
  });

  // WENDIGO CATCHES PLAYER
  if (wendigo.active && player.overlaps(wendigo)) {
    biteSound.setVolume(0.7);
    biteSound.play();
    endGame(false);
  }

  // WIN CONDITION
  if (score > 3000) {
    endGame(true);
  }
}

// -------------------------------------
// END GAME
// -------------------------------------
function endGame(won) {
  if (score > highScore) highScore = score;

  footstepsSound.stop();
  breathingSound.stop();

  gameState = won ? "win" : "gameover";
}

// -------------------------------------
// DRAWING
// -------------------------------------
function drawGame() {
  drawUI();
}

// -------------------------------------
// UI + SCREENS
// -------------------------------------
function drawUI() {
  fill(255);
  textSize(18);
  text("Score: " + score, 10, 10);
  text("High: " + highScore, 10, 30);
  text("Health: " + player.health, 10, 50);
}

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
