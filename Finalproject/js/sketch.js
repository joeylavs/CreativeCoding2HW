// --- GLOBAL VARIABLES ---
let player, wendigo;
let treeGroup, rockGroup;
let playerImg, wendigoImg, treeImg, rockImg;

function preload() {
  playerImg = loadImage("assets/player/player1.png");
  wendigoImg = loadImage("assets/enemy/wendigo1.png");
  treeImg = loadImage("assets/images/tree1.png");
  rockImg = loadImage("assets/images/rock1.png");
}

function setup() {
  createCanvas(800, 600);

  console.log("Sprite test:", createSprite);

  // PLAYER — start in the middle
  player = new Sprite(width / 2, height / 2);
  player.img = playerImg;
  player.w = 20;
  player.h = 20;
  player.collider = "none";

  // WENDIGO — start BELOW the screen
  wendigo = new Sprite(width / 2, height + 80);
  wendigo.img = wendigoImg;
  wendigo.w = 28;
  wendigo.h = 28;
  wendigo.collider = "none";

  // GROUPS
  treeGroup = new Group();
  rockGroup = new Group();

  // TREES — spawn above screen
  for (let i = 0; i < 6; i++) {
    let t = new Sprite(random(100, width - 100), random(-600, -50));
    t.img = treeImg;
    t.w = 40;
    t.h = 60;
    t.collider = "none";
    treeGroup.add(t);
  }

  // ROCKS — spawn above screen
  for (let i = 0; i < 6; i++) {
    let r = new Sprite(random(100, width - 100), random(-600, -50));
    r.img = rockImg;
    r.w = 30;
    r.h = 20;
    r.collider = "none";
    rockGroup.add(r);
  }
}

function draw() {
  background(0);

  // PLAYER MOVEMENT
  if (kb.pressing("left")) player.x -= 4;
  if (kb.pressing("right")) player.x += 4;
  if (kb.pressing("up")) player.y -= 4;
  if (kb.pressing("down")) player.y += 4;

  // WORLD SCROLL SPEED
  let scrollSpeed = 3;

  // MOVE TREES DOWN
  for (let t of treeGroup) {
    t.y += scrollSpeed;

    // Respawn above screen
    if (t.y > height + 50) {
      t.y = random(-600, -50);
      t.x = random(100, width - 100);
    }
  }

  // MOVE ROCKS DOWN
  for (let r of rockGroup) {
    r.y += scrollSpeed;

    if (r.y > height + 50) {
      r.y = random(-600, -50);
      r.x = random(100, width - 100);
    }
  }

  // COLLISION CHECK
  if (player.overlaps(treeGroup) || player.overlaps(rockGroup)) {
    moveWendigoCloser();
  }
}

function moveWendigoCloser() {
  let dx = player.x - wendigo.x;
  let dy = player.y - wendigo.y;
  let step = 0.05;

  wendigo.x += dx * step;
  wendigo.y += dy * step;
}
