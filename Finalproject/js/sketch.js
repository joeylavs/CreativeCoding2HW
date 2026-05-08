// --- GLOBAL VARIABLES ---
let player, wendigo;
let treeGroup, rockGroup;
let playerImg, wendigoImg, treeImg, rockImg;

let gameState = "start"; 
let scrollSpeed = 3;     // world scroll speed
let wendigoSpeed = 0.5;  // vertical chase speed
let wendigoBoost = 0.2;  // speed gained per collision

function preload() {
  playerImg = loadImage("assets/player/player1.png");
  wendigoImg = loadImage("assets/enemy/wendigo1.png");
  treeImg = loadImage("assets/images/tree1.png");
  rockImg = loadImage("assets/images/rock1.png");
}

function setup() {
  createCanvas(800, 600);

  // PLAYER — start in the middle
  player = new Sprite(width / 2, height / 2);
  player.collider = "none";
  player.img = playerImg;
  player.img.scale = 0.1;

  // WENDIGO — start BELOW the screen
  wendigo = new Sprite(width / 2, height + 80);
  wendigo.collider = "none";
  wendigo.img = wendigoImg;
  wendigo.img.scale = 0.12;

  // GROUPS
  treeGroup = new Group();
  rockGroup = new Group();

  // TREES — spawn above screen (12 for difficulty)
  for (let i = 0; i < 12; i++) {
    let t = new Sprite(random(100, width - 100), random(-800, -50));
    t.collider = "none";
    t.img = treeImg;
    t.img.scale = 0.15;
    treeGroup.add(t);
  }

  // ROCKS — spawn above screen (12 for difficulty)
  for (let i = 0; i < 12; i++) {
    let r = new Sprite(random(100, width - 100), random(-800, -50));
    r.collider = "none";
    r.img = rockImg;
    r.img.scale = 0.12;
    rockGroup.add(r);
  }
}

function draw() {
  // WHITE SNOW BACKGROUND
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
    textAlign(CENTER, CENTER);
    textSize(50);
    fill(0);
    text("GAME OVER", width / 2, height / 2 - 20);

    textSize(24);
    text("Press R to Restart", width / 2, height / 2 + 40);

    if (kb.presses("r")) resetGame();
    return;
  }

  // GAMEPLAY 
  if (gameState === "play") {

    // PLAYER MOVEMENT
    if (kb.pressing("left")) player.x -= 4;
    if (kb.pressing("right")) player.x += 4;
    if (kb.pressing("up")) player.y -= 4;
    if (kb.pressing("down")) player.y += 4;

    // INCREASE DIFFICULTY OVER TIME
    scrollSpeed += 0.002;
    scrollSpeed = min(scrollSpeed, 12);

    // MOVE TREES DOWN
    for (let t of treeGroup) {
      t.y += scrollSpeed;

      if (t.y > height + 50) {
        t.y = random(-800, -200);
        t.x = random(100, width - 100);
      }
    }

    // MOVE ROCKS DOWN
    for (let r of rockGroup) {
      r.y += scrollSpeed;

      if (r.y > height + 50) {
        r.y = random(-800, -200);
        r.x = random(100, width - 100);
      }
    }

    // COLLISION WITH OBSTACLES → WENDIGO GETS CLOSER + FASTER
    if (player.overlaps(treeGroup) || player.overlaps(rockGroup)) {
      moveWendigoCloser();
    }

    // WENDIGO FOLLOWS PLAYER LEFT/RIGHT
    let dx = player.x - wendigo.x;
    wendigo.x += dx * 0.05;

    // WENDIGO MOVES UPWARD TOWARD PLAYER
    wendigo.y -= wendigoSpeed;

    // COLLISION WITH WENDIGO → GAME OVER
    let d = dist(player.x, player.y, wendigo.x, wendigo.y);
    if (d < 40) {
      gameState = "gameover";
    }
  }
}

function moveWendigoCloser() {
  // Boost vertical chase speed
  wendigoSpeed += wendigoBoost;

  // Pull Wendigo slightly upward
  wendigo.y -= 10;
}

function resetGame() {
  // Reset player
  player.x = width / 2;
  player.y = height / 2;

  // Reset Wendigo
  wendigo.x = width / 2;
  wendigo.y = height + 80;

  // Reset obstacles
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

  gameState = "start";
}
