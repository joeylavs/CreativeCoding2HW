// --- GLOBAL VARIABLES ---
let player, wendigo, goal;
let treeGroup, rockGroup;
let playerImg, wendigoImg, treeImg, rockImg, goalImg;

// Sounds
let biteSound, breathingSound, footstepsSound, roarSound;

let gameState = "start"; // "start", "play", "gameover", "win"
let scrollSpeed = 3;     // world scroll speed
let wendigoSpeed = 0.5;  // how much closer he moves per collision
let wendigoBoost = 0.2;  // how much stronger each collision makes him

function preload() {
  // Images
  playerImg = loadImage("assets/player/player1.png");
  wendigoImg = loadImage("assets/enemy/wendigo1.png");
  treeImg = loadImage("assets/images/tree1.png");
  rockImg = loadImage("assets/images/rock1.png");

  // Goal image (placeholder)
  goalImg = loadImage("assets/images/tree1.png");

  // Sounds (correct folder!)
  biteSound = loadSound("sounds/Bite.wav");
  breathingSound = loadSound("sounds/Breathing_fast.wav");
  footstepsSound = loadSound("sounds/Footsteps_ running.wav");
  roarSound = loadSound("sounds/Monster_Roar_2.wav");
}

function setup() {
  createCanvas(800, 600);

  // PLAYER
  player = new Sprite(width / 2, height / 2);
  player.collider = "none";
  player.img = playerImg;
  player.img.scale = 0.1;

  // WENDIGO
  wendigo = new Sprite(width / 2, height + 80);
  wendigo.collider = "none";
  wendigo.img = wendigoImg;
  wendigo.img.scale = 0.12;

  // END GOAL
  goal = new Sprite(width / 2, -2000);
  goal.collider = "none";
  goal.img = goalImg;
  goal.img.scale = 0.3;

  // GROUPS
  treeGroup = new Group();
  rockGroup = new Group();

  // TREES
  for (let i = 0; i < 12; i++) {
    let t = new Sprite(random(100, width - 100), random(-800, -50));
    t.collider = "none";
    t.img = treeImg;
    t.img.scale = 0.15;
    treeGroup.add(t);
  }

  // ROCKS
  for (let i = 0; i < 12; i++) {
    let r = new Sprite(random(100, width - 100), random(-800, -50));
    r.collider = "none";
    r.img = rockImg;
    r.img.scale = 0.12;
    rockGroup.add(r);
  }
}

function draw() {
  background(255);

  // START SCREEN
  if (gameState === "start") {
    textAlign(CENTER, CENTER);
    textSize(40);
    fill(0);
    text("WENDIGO RUN", width / 2, height / 2 - 40);

    textSize(24);
    text("Press SPACE to Start", width / 2, height / 2 + 20);

    if (kb.presses("space")) {
      scrollSpeed = 3;
      wendigoSpeed = 0.5;
      gameState = "play";
    }
    return;
  }

  // GAME OVER SCREEN
  if (gameState === "gameover") {
    breathingSound.stop();
    footstepsSound.stop();

    textAlign(CENTER, CENTER);
    textSize(50);
    fill(0);
    text("GAME OVER", width / 2, height / 2 - 20);

    textSize(24);
    text("Press R to Restart", width / 2, height / 2 + 40);

    if (kb.presses("r")) resetGame();
    return;
  }

  // WIN SCREEN
  if (gameState === "win") {
    breathingSound.stop();
    footstepsSound.stop();

    textAlign(CENTER, CENTER);
    textSize(50);
    fill(0);
    text("YOU ESCAPED!", width / 2, height / 2 - 20);

    textSize(24);
    text("Press R to Restart", width / 2, height / 2 + 40);

    if (kb.presses("r")) resetGame();
    return;
  }

  // GAMEPLAY
  if (gameState === "play") {

    // PLAYER MOVEMENT + FOOTSTEP SOUND
    if (kb.pressing("left")) player.x -= 4;
    if (kb.pressing("right")) player.x += 4;
    if (kb.pressing("up")) player.y -= 4;
    if (kb.pressing("down")) player.y += 4;

    if (kb.pressing("left") || kb.pressing("right") || kb.pressing("up") || kb.pressing("down")) {
      if (!footstepsSound.isPlaying()) footstepsSound.loop();
    } else {
      footstepsSound.stop();
    }

    // DIFFICULTY RAMP
    scrollSpeed += 0.002;
    scrollSpeed = min(scrollSpeed, 12);

    // MOVE TREES
    for (let t of treeGroup) {
      t.y += scrollSpeed;
      if (t.y > height + 50) {
        t.y = random(-800, -200);
        t.x = random(100, width - 100);
      }
    }

    // MOVE ROCKS
    for (let r of rockGroup) {
      r.y += scrollSpeed;
      if (r.y > height + 50) {
        r.y = random(-800, -200);
        r.x = random(100, width - 100);
      }
    }

    // MOVE GOAL
    goal.y += scrollSpeed;

    // COLLISION WITH OBSTACLES → WENDIGO MOVES CLOSER
    if (player.overlaps(treeGroup) || player.overlaps(rockGroup)) {
      if (!biteSound.isPlaying()) biteSound.play();
      moveWendigoCloser();
    }

    // WENDIGO FOLLOWS PLAYER LEFT/RIGHT
    let dx = player.x - wendigo.x;
    wendigo.x += dx * 0.05;

    // WENDIGO NEVER PASSES PLAYER
    if (wendigo.y < player.y + 40) {
      wendigo.y = player.y + 40;
    }

    // DISTANCE CHECK FOR SOUNDS
    let d = dist(player.x, player.y, wendigo.x, wendigo.y);

    if (d < 200) {
      if (!breathingSound.isPlaying()) breathingSound.loop();
    } else {
      breathingSound.stop();
    }

    if (d < 80) {
      if (!roarSound.isPlaying()) roarSound.play();
    }

    // WENDIGO HITS PLAYER → GAME OVER
    if (d < 40) {
      gameState = "gameover";
    }

    // PLAYER REACHES GOAL → WIN
    if (player.overlaps(goal)) {
      gameState = "win";
    }
  }
}

function moveWendigoCloser() {
  // Move Wendigo upward ONLY when player hits something
  wendigo.y -= 10;

  // Increase how strong each future pull is
  wendigoSpeed += wendigoBoost;
}

function resetGame() {
  player.x = width / 2;
  player.y = height / 2;

  wendigo.x = width / 2;
  wendigo.y = height + 80;

  goal.y = -2000;

  for (let t of treeGroup) {
    t.y = random(-800, -200);
    t.x = random(100, width - 100);
  }
  for (let r of rockGroup) {
    r.y = random(-800, -200);
    r.x = random(100, width - 100);
  }

  scrollSpeed = 3;
  wendigoSpeed = 0.5;

  biteSound.stop();
  breathingSound.stop();
  footstepsSound.stop();
  roarSound.stop();

  gameState = "start";
}
