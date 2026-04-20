let player;
let obstacles = [];
let collectibles = [];
let gameManager;
let mazeWalls = [];
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
console.log("thiefImg:", thiefImg);
console.log("guardImg:", guardImg);
console.log("gemImg:", gemImg);
// Maze layout
mazeWalls.push(new MazeWall(50, 50, 700, 20));   // top wall
mazeWalls.push(new MazeWall(50, 530, 700, 20));  // bottom wall
mazeWalls.push(new MazeWall(50, 50, 20, 500));   // left wall
mazeWalls.push(new MazeWall(730, 50, 20, 500));  // right wall

// inner maze walls
mazeWalls.push(new MazeWall(150, 150, 400, 20));
mazeWalls.push(new MazeWall(150, 150, 20, 300));
mazeWalls.push(new MazeWall(300, 300, 300, 20));
mazeWalls.push(new MazeWall(500, 100, 20, 220));

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
for (let wall of mazeWalls) {
  wall.display();

  if (wall.hits(player)) {
    player.x = player.prevX;
    player.y = player.prevY;
  }
}

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

