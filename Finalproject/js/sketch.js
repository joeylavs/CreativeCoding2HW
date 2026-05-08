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

  // Player
  player = new Sprite(width / 2, height - 100);
  player.img = playerImg;
  player.scale = 0.15;
  player.collider = "none"; // no physics body

  // Wendigo
  wendigo = new Sprite(width / 2, 100);
  wendigo.img = wendigoImg;
  wendigo.scale = 0.2;
  wendigo.collider = "none";

  // Groups
  treeGroup = new Group();
  rockGroup = new Group();

  // Trees
  for (let i = 0; i < 5; i++) {
    let t = new Sprite(random(100, width - 100), random(150, height - 200));
    t.img = treeImg;
    t.scale = .4;
    t.collider = "static";
    treeGroup.add(t);
  }

  // Rocks
  for (let i = 0; i < 5; i++) {
    let r = new Sprite(random(100, width - 100), random(150, height - 200));
    r.img = rockImg;
    r.scale = .4;
    r.collider = "static";
    rockGroup.add(r);
  }
}

function draw() {
  background(0);

  // Player movement
  if (kb.pressing("left")) player.x -= 4;
  if (kb.pressing("right")) player.x += 4;
  if (kb.pressing("up")) player.y -= 4;
  if (kb.pressing("down")) player.y += 4;

  // Collision detection (v3 syntax)
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
