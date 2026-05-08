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

  // Debug: confirm p5play loaded
  console.log("Sprite test:", createSprite);

  // PLAYER ----------------------------------------------------
  player = new Sprite(width / 2, height - 100);
  player.img = playerImg;

  // Correct size for 16x16 pixel art
  player.w = 20;
  player.h = 20;

  player.collider = "none";

  // WENDIGO ---------------------------------------------------
  wendigo = new Sprite(width / 2, 100);
  wendigo.img = wendigoImg;

  // Slightly bigger than player
  wendigo.w = 28;
  wendigo.h = 28;

  wendigo.collider = "none";

  // GROUPS ----------------------------------------------------
  treeGroup = new Group();
  rockGroup = new Group();

  // TREES -----------------------------------------------------
  for (let i = 0; i < 5; i++) {
    let t = new Sprite(random(100, width - 100), random(150, height - 200));
    t.img = treeImg;

    // Good tree size
    t.w = 40;
    t.h = 60;

    t.collider = "static";
    treeGroup.add(t);
  }

  // ROCKS -----------------------------------------------------
  for (let i = 0; i < 5; i++) {
    let r = new Sprite(random(100, width - 100), random(150, height - 200));
    r.img = rockImg;

    // Good rock size
    r.w = 30;
    r.h = 20;

    r.collider = "static";
    rockGroup.add(r);
  }
}

function draw() {
  background(0);

  // PLAYER MOVEMENT -------------------------------------------
  if (kb.pressing("left")) player.x -= 4;
  if (kb.pressing("right")) player.x += 4;
  if (kb.pressing("up")) player.y -= 4;
  if (kb.pressing("down")) player.y += 4;

  // COLLISION CHECK -------------------------------------------
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
