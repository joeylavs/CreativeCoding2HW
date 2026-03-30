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

// Optional timer
let gameTime = 60;
let startTime;

// ----- PRELOAD -----
function preload() {
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
  world.gravity.y = 0;

  cnv.elt.tabIndex = 0;
  cnv.elt.focus();

  // Player sprite
  player = new Sprite(width / 2, height / 2, 40, 40);
  player.addAni("move", playerAnim);
  player.ani = "move";
  player.rotationLock = true;

  // Obstacles
  obstacles = new Group();
  for (let i = 0; i < 3; i++) {
    let o = new obstacles.Sprite(
      random(80, width - 80),
      random(80, height - 80),
      random(80, 140),
      30
    );
    o.color = "gray";
    o.collider = "static";
  }

  // Good items
  goodItems = new Group();
  for (let i = 0; i < 5; i++) spawnGoodItem();

  // Bad items
  badItems = new Group();
  for (let i = 0; i < 3; i++) spawnBadItem();

  startTime = millis();
}

// ----- START MUSIC -----
function mousePressed() {
  cnv.elt.focus();
  if (!bgMusic.isPlaying()) bgMusic.loop();
}

function keyPressed() {
  cnv.elt.focus();
}

// ----- SPAWN HELPERS -----
function spawnGoodItem() {
  let g = new goodItems.Sprite(
    random(40, width - 40),
    random(40, height - 40),
    32,
    32
  );
  g.addImage(goodFoodImg);   // FIXED
  g.scale = 0.8;
}

function spawnBadItem() {
  let b = new badItems.Sprite(
    random(40, width - 40),
    random(40, height - 40),
    32,
    32
  );
  b.addImage(badFoodImg);    // FIXED
  b.scale = 0.8;
}

// ----- DRAW LOOP -----
function draw() {
  background(50);

  let elapsed = (millis() - startTime) / 1000;
  let remaining = max(0, gameTime - elapsed);

  if (remaining <= 0 && gameState === "play") {
    gameState = "lose";
  }

  if (gameState === "play") {
    handleMovement();
    handleCollisions();
  } else {
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

  if (kb.pressing("a") || kb.pressing("left")) player.vel.x = -speed;
  if (kb.pressing("d") || kb.pressing("right")) player.vel.x = speed;
  if (kb.pressing("w") || kb.pressing("up")) player.vel.y = -speed;
  if (kb.pressing("s") || kb.pressing("down")) player.vel.y = speed;

  player.x = constrain(player.x, 20, width - 20);
  player.y = constrain(player.y, 20, height - 20);
}

// ----- COLLISIONS -----
function handleCollisions() {
  player.collide(obstacles);

  player.overlap(goodItems, (p, item) => {
    score++;
    if (goodSound) goodSound.play();
    item.remove();
    spawnGoodItem();
    if (score >= 10) gameState = "win";
  });

  player.overlap(badItems, (p, item) => {
    health--;
    if (badSound) badSound.play();
    item.remove();
    spawnBadItem();
    if (health <= 0) gameState = "lose";
  });
}

// ----- UI -----
function drawHUD(remaining) {
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Score: " + score, 20, 20);
  text("Health: " + health, 20, 45);
  text("Time: " + remaining.toFixed(1), 20, 70);
}

function drawGameStateMessage() {
  if (gameState === "play") return;

  textAlign(CENTER, CENTER);
  textSize(40);

  if (gameState === "win") {
    fill("lime");
    text("YOU WIN! Score 10!", width / 2, height / 2);
  } else {
    fill("red");
    text("GAME OVER!", width / 2, height / 2);
  }
}
