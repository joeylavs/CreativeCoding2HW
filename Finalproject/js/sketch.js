let player, wendigo;
let treeGroup, rockGroup;
let playerImg, wendigoImg, treeImg, rockImg;

function preload() {
  // Load all images
  playerImg = loadImage('assets/player/player1.png');
  wendigoImg = loadImage('assets/enemy/wendigo1.png');
  treeImg = loadImage('assets/images/tree1.png');
  rockImg = loadImage('assets/images/rock1.png');
}

function setup() {
  createCanvas(800, 600);

  // Player setup
  player = createSprite(width / 2, height - 100);
  player.addImage(playerImg);
  player.scale = 0.3;

  // Wendigo setup
  wendigo = createSprite(width / 2, 100);
  wendigo.addImage(wendigoImg);
  wendigo.scale = 1;

  // Groups for obstacles
  treeGroup = new Group();
  rockGroup = new Group();

  // Generate obstacles
  for (let i = 0; i < 5; i++) {
    let tree = createSprite(random(100, width - 100), random(200, height - 150));
    tree.addImage(treeImg);
    tree.scale = 1;
    treeGroup.add(tree);

    let rock = createSprite(random(100, width - 100), random(200, height - 150));
    rock.addImage(rockImg);
    rock.scale = 1;
    rockGroup.add(rock);
  }
}

function draw() {
  background(0);

  // Player movement
  if (keyIsDown(LEFT_ARROW)) player.position.x -= 4;
  if (keyIsDown(RIGHT_ARROW)) player.position.x += 4;
  if (keyIsDown(UP_ARROW)) player.position.y -= 4;
  if (keyIsDown(DOWN_ARROW)) player.position.y += 4;

  // Collision detection
  if (player.overlap(treeGroup) || player.overlap(rockGroup)) {
    moveWendigoCloser();
  }

  drawSprites();
}

function moveWendigoCloser() {
  // Move Wendigo slightly toward player
  let dx = player.position.x - wendigo.position.x;
  let dy = player.position.y - wendigo.position.y;
  let step = 0.05; // speed factor

  wendigo.position.x += dx * step;
  wendigo.position.y += dy * step;
}
