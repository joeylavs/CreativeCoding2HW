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

// Particle system
let particles = [];

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

  // Bad items (enemies)
  badItems = new Group();
  for (let i = 0; i < 3; i++) spawnBadItem();
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
  g.addImage(goodFoodImg);
  g.scale = 0.8;
}

function spawnBadItem() {
  let b = new badItems.Sprite(
    random(40, width - 40),
    random(40, height - 40),
    32,
    32
  );
  b.addImage(badFoodImg);
  b.scale = 0.8;

  b.health = 3; // enemy health
}

// ----- DRAW LOOP -----
function draw() {
  background(50);

  if (gameState === "play") {
    handleMovement();
    handleCollisions();
  } else {
    player.vel.x = 0;
    player.vel.y = 0;
  }

  updateParticles();
  drawHUD();
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

  // Good food
  player.overlap(goodItems, (p, item) => {
    score++;
    if (goodSound) goodSound.play();
    item.remove();
    spawnGoodItem();
  });

  // Enemy attack
  player.overlap(badItems, (p, enemy) => {
    damageEnemy(enemy);
  });
}

// ----- ENEMY DAMAGE + PARTICLES -----
function damageEnemy(enemy) {
  enemy.health--;
  if (badSound) badSound.play();

  // spawn particles
  for (let i = 0; i < 15; i++) {
    particles.push(new Particle(enemy.x, enemy.y));
  }

  // remove enemy if dead
  if (enemy.health <= 0) {
    enemy.remove();
  }

  // WIN CONDITION
  if (badItems.length === 0) {
    gameState = "win";
  }
}

// ----- PARTICLE SYSTEM -----
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.life = 30;
    this.size = random(4, 8);
    this.col = color(255, random(100, 200), 0);
  }

  update() {
    this.pos.add(this.vel);
    this.life--;
  }

  draw() {
    noStroke();
    fill(
      red(this.col),
      green(this.col),
      blue(this.col),
      map(this.life, 0, 30, 0, 255)
    );
    circle(this.pos.x, this.pos.y, this.size);
  }

  isDead() {
    return this.life <= 0;
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].isDead()) particles.splice(i, 1);
  }
}

// ----- UI -----
function drawHUD() {
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Score: " + score, 20, 20);
  text("Health: " + health, 20, 45);
}

function drawGameStateMessage() {
  if (gameState === "play") return;

  textAlign(CENTER, CENTER);
  textSize(40);

  if (gameState === "win") {
    fill("lime");
    text("YOU WIN!", width / 2, height / 2);
  } else {
    fill("red");
    text("GAME OVER!", width / 2, height / 2);
  }
}
