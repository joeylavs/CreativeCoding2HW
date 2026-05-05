let player;
let obstacles = [];
let wendigo;
let gameState = "start";
let score = 0;
let highScore = 0;
let baseSpeed = 3;
let obstacleSpawnTimer = 0;
let wendigoTimer = 0;

function setup() {
  createCanvas(800, 600);
  resetGame();
}

function resetGame() {
  player = {
    x: width / 2,
    y: height - 100,
    vx: 0,
    w: 30,
    h: 40,
    health: 3
  };
  obstacles = [];
  wendigo = {
    x: width / 2,
    y: -200,
    speed: 1.5,
    active: false
  };
  score = 0;
  baseSpeed = 3;
  obstacleSpawnTimer = 0;
  wendigoTimer = 0;
  gameState = "start";
}

function draw() {
  background(10, 20, 40); // night sky

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

function drawStartScreen() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Wendigo Run", width / 2, height / 2 - 40);
  textSize(18);
  text("Left/Right to move. Survive as long as you can.", width / 2, height / 2);
  text("Press SPACE to start", width / 2, height / 2 + 40);
}

function keyPressed() {
  if (gameState === "start" && key === ' ') {
    gameState = "play";
  } else if ((gameState === "gameover" || gameState === "win") && key === ' ') {
    resetGame();
  }
}

function updateGame() {
  score += 1;
  baseSpeed += 0.0008; // slowly speed up
  obstacleSpawnTimer++;
  wendigoTimer++;

  // Activate Wendigo after some time
  if (!wendigo.active && wendigoTimer > 600) { // ~10 seconds at 60fps
    wendigo.active = true;
  }

  handleInput();
  updatePlayer();
  spawnObstacles();
  updateObstacles();
  updateWendigo();
  checkCollisions();
}

function handleInput() {
  let targetVx = 0;
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // A
    targetVx = -5;
  } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // D
    targetVx = 5;
  }
  // simple easing for slippery feel
  player.vx = lerp(player.vx, targetVx, 0.2);
}

function updatePlayer() {
  player.x += player.vx;
  player.x = constrain(player.x, player.w / 2, width - player.w / 2);
}

function spawnObstacles() {
  if (obstacleSpawnTimer > 30) {
    obstacleSpawnTimer = 0;
    let x = random(40, width - 40);
    let size = random(20, 50);
    let type = random() < 0.7 ? "tree" : "rock";
    obstacles.push({ x, y: -50, size, type });
  }
}

function updateObstacles() {
  for (let o of obstacles) {
    o.y += baseSpeed;
  }
  obstacles = obstacles.filter(o => o.y < height + 60);
}

function updateWendigo() {
  if (!wendigo.active) return;

  // Move Wendigo down toward player
  wendigo.y += wendigo.speed;

  // Slight horizontal tracking
  let dir = player.x - wendigo.x;
  wendigo.x += dir * 0.02;

  // If Wendigo is too far above, slowly catch up
  if (wendigo.y < player.y - 200) {
    wendigo.y += 0.5;
  }
}

function checkCollisions() {
  // Obstacles
  for (let o of obstacles) {
    let d = dist(player.x, player.y, o.x, o.y);
    if (d < (o.size / 2 + max(player.w, player.h) / 2)) {
      // Hit obstacle
      player.health--;
      // Knock back a bit
      player.y += 10;
      // Move obstacle offscreen so it doesn't keep hitting
      o.y = height + 100;
      // Wendigo gains on you when you stumble
      if (wendigo.active) {
        wendigo.y += 20;
      }
      if (player.health <= 0) {
        endGame(false);
        return;
      }
    }
  }

  // Wendigo catch
  if (wendigo.active) {
    let dW = dist(player.x, player.y, wendigo.x, wendigo.y);
    if (dW < 50) {
      endGame(false);
      return;
    }
  }

  // Optional win condition: survive long enough
  if (score > 3000) {
    endGame(true);
  }
}

function endGame(won) {
  if (score > highScore) highScore = score;
  gameState = won ? "win" : "gameover";
}

function drawGame() {
  drawSnow();
  drawObstacles();
  drawPlayer();
  drawWendigo();
  drawUI();
}

function drawSnow() {
  
  stroke(40, 80, 60);
  for (let x = 0; x < width; x += 80) {
    line(x + 20, 0, x, height);
  }
  noStroke();
}

function drawObstacles() {
  for (let o of obstacles) {
    if (o.type === "tree") {
      fill(20, 100, 40);
      ellipse(o.x, o.y, o.size, o.size * 1.4);
    } else {
      fill(120);
      ellipse(o.x, o.y, o.size);
    }
  }
}

function drawPlayer() {
  // Native runner placeholder
  fill(230, 200, 150);
  rectMode(CENTER);
  rect(player.x, player.y, player.w, player.h);
}

function drawWendigo() {
  if (!wendigo.active) return;
  // Simple creepy silhouette
  push();
  translate(wendigo.x, wendigo.y);
  fill(30);
  ellipse(0, -20, 40, 40); // head
  rectMode(CENTER);
  rect(0, 20, 30, 60); // body
  fill(255, 0, 0);
  ellipse(-8, -22, 6, 6);
  ellipse(8, -22, 6, 6);
  pop();
}

function drawUI() {
  fill(255);
  textAlign(LEFT, TOP);
  textSize(16);
  text("Score: " + score, 10, 10);
  text("High: " + highScore, 10, 30);
  text("Health: " + player.health, 10, 50);
}

function drawGameOver() {
  fill(0, 180);
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Caught by the Wendigo", width / 2, height / 2 - 20);
  textSize(18);
  text("Score: " + score, width / 2, height / 2 + 10);
  text("Press SPACE to restart", width / 2, height / 2 + 40);
}

function drawWin() {
  fill(0, 180);
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("You survived the woods", width / 2, height / 2 - 20);
  textSize(18);
  text("Score: " + score, width / 2, height / 2 + 10);
  text("Press SPACE to restart", width / 2, height / 2 + 40);
}

