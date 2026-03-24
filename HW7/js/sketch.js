// ----- GLOBAL STATE -----
let cnv;

// p5.play sprites & groups
let player;
let obstacles;
let goodItems;
let badItems;

// Animations & images
let playerAnim;
let goodFoodImg;
let badFoodImg;

// Sounds
let bgMusic;
let goodSound;
let badSound;

// Game state
let score = 0;
let health = 3;
let gameState = "play"; // "play", "win", "lose"

// Optional timer (not required for HW9, but kept simple)
let gameTime = 60; // seconds
let startTime;

// ----- PRELOAD -----
function preload() {
  // 2-frame animation using your existing images
  playerAnim = loadAnimation("images/idle.png", "images/walking.png");

  goodFoodImg = loadImage("images/pizza.png");
  badFoodImg = loadImage("images/broccoli.png");

  bgMusic = loadSound("sounds/background.mp3");
  goodSound = loadSound("sounds/good.wav");
  badSound = loadSound("sounds/bad.wav");
}

// ----- SETUP -----
function setup() {
  cnv = createCanvas(800, 600);
  world.gravity.y = 0; // top-down, no gravity

  // allow keyboard input on GitHub Pages
  cnv.elt.tabIndex = 0;
  cnv.elt.focus();

  // Player sprite
  player = new Sprite(width / 2, height / 2, 40, 40);
  player.addAni("move", playerAnim);
  player.ani = "move";
  player.rotationLock = true;

  // Obstacles group
  obstacles = new Group();
  for (let i = 0; i < 3; i++) {
    let ox = random(80, width - 80);
    let oy = random(80, height - 80);
    let o = new obstacles.Sprite(ox, oy, random(80, 140), 30);
    o.color = "gray";
    o.collider = "static"; // immovable
  }

  // Good items group
  goodItems = new Group();
  for (let i = 0; i < 5; i++) {
    spawnGoodItem();
  }

  // Bad items group
  badItems = new Group();
  for (let i = 0; i < 3; i++) {
    spawnBadItem();
  }

  startTime = millis();
}

// ----- START MUSIC + FOCUS ON CLICK -----
function mousePressed() {
  cnv.elt.focus();
  if (!bgMusic.isPlaying()) {
    bgMusic.loop();
  }
}

// ----- KEEP FOCUS ON KEY PRESS -----
function keyPressed() {
  cnv.elt.focus();
}

// ----- SPAWN HELPERS -----
function spawnGoodItem() {
  let gx = random(40, width - 40);
  let gy = random(40, height - 40);
  let g = new goodItems.Sprite(gx, gy, 32, 32);
  g.img = goodFoodImg;
  g.scale = 0.8;
}

function spawnBadItem() {
  let bx = random(40, width - 40);
  let by = random(40, height - 40);
  let b = new badItems.Sprite(bx, by, 32, 32);
  b.img = badFoodImg;
  b.scale = 0.8;
}

// ----- DRAW LOOP -----
function draw() {
  background(50);

  // TIMER (optional)
  let elapsed = (millis() - startTime) / 1000;
  let remaining = max(0, gameTime - elapsed);

  if (remaining <= 0 && gameState === "play") {
    gameState = "lose";
  }

  if (gameState === "play") {
    handleMovement();
    handleCollisions();
  } else {
    // stop player when game over
    player.vel.x = 0;
    player.vel.y = 0;
  }

  drawHUD(remaining);
  drawGameStateMessage();
}

// ----- MOVEMENT -----
function handleMovement() {
  let speed = 4;
  player.vel.x = 0;
  player.vel.y = 0;

  if (kb.pressing("a") || kb.pressing("left")) {
    player.vel.x = -speed;
  }
  if (kb.pressing("d") || kb.pressing("right")) {
    player.vel.x = speed;
  }
  if (kb.pressing("w") || kb.pressing("up")) {
    player.vel.y = -speed;
  }
  if (kb.pressing("s") || kb.pressing("down")) {
    player.vel.y = speed;
  }

  // keep inside canvas
  player.x = constrain(player.x, 20, width - 20);
  player.y = constrain(player.y, 20, height - 20);
}

// ----- COLLISIONS -----
function handleCollisions() {
  // collide with obstacles (blocks movement)
  player.collide(obstacles);

  // good items
  player.overlap(goodItems, (p, item) => {
    score++;
    if (goodSound) goodSound.play();
    item.remove();
    spawnGoodItem();

    if (score >= 10 && gameState === "play") {
      gameState = "win";
    }
  });

  // bad items
  player.overlap(badItems, (p, item) => {
    health--;
    if (badSound) badSound.play();
    item.remove();
    spawnBadItem();

    if (health <= 0 && gameState === "play") {
      gameState = "lose";
    }
  });
}

// ----- UI -----
function drawHUD(remaining) {
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Score: " + score, 20, 20);
  text("Health: " + health, 20, 45);

  let safeTime = isNaN(remaining) ? 0 : remaining;
  text("Time: " + safeTime.toFixed(1), 20, 70);
}

function drawGameStateMessage() {
  if (gameState === "play") return;

  textAlign(CENTER, CENTER);
  textSize(40);
  if (gameState === "win") {
    fill("lime");
    text("YOU WIN! Score 10!", width / 2, height / 2);
  } else if (gameState === "lose") {
    fill("red");
    text("GAME OVER!", width / 2, height / 2);
  }
}
