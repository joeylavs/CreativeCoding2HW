let player;
let obstacles = [];
let collectibles = [];
let gameManager;
let thiefImg;
let guardImg;
let gemImg;
let bgImg;

function preload() {
  thiefImg = loadImage("assets/images/thief.png");
  guardImg = loadImage("assets/images/guard.png");
  gemImg = loadImage("assets/images/gem.png");
}


function setup() {
  createCanvas(800, 600);

  gameManager = new GameManager();

  player = new Player(width / 2, height / 2);

  // Create 5 obstacles
  for (let i = 0; i < 5; i++) {
    obstacles.push(new Obstacle(random(50, 750), random(50, 550)));
  }

  // Create 5 collectibles
  for (let i = 0; i < 5; i++) {
    collectibles.push(new Collectible(random(50, 750), random(50, 550)));
  }
}

function draw() {
  background(40); // dungeon vibe

  gameManager.update();
  gameManager.display();

  if (gameManager.state === "playing") {
    player.update();
    player.display();

    // Obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].update(player);
      obstacles[i].display();

      if (obstacles[i].hits(player)) {
        player.health--;
        obstacles.splice(i, 1);
      }
    }

    // Collectibles
    for (let i = collectibles.length - 1; i >= 0; i--) {
      collectibles[i].display();

      if (collectibles[i].collected(player)) {
        player.score += 10;
        gameManager.collected++;
        collectibles.splice(i, 1);
      }
    }

    gameManager.checkWinLose(player);
  }
}

