// -----------------------------
// Animation variables
// -----------------------------
let danceFrames = [];
let frameIndex = 0;
let frameTimer = 0;
let frameDelay = 8;

// Character position & speed
let charX = 200;
let charY = 200;
let charSpeed = 2;

// Food array
let foods = [];

// -----------------------------
// PRELOAD — load dancing frames
// -----------------------------
function preload() {
  danceFrames.push(loadImage("images/dancing1.png"));
  danceFrames.push(loadImage("images/dancing2.png"));
  danceFrames.push(loadImage("images/dancing3.png"));
}

// -----------------------------
// SETUP — canvas + food objects
// -----------------------------
function setup() {
  createCanvas(600, 400);

  foods.push(new Food(100, 300, 40, color(255, 0, 0)));
  foods.push(new Food(200, 250, 60, color(0, 255, 0)));
  foods.push(new Food(300, 320, 50, color(0, 0, 255)));
  foods.push(new Food(400, 280, 70, color(255, 165, 0)));
  foods.push(new Food(500, 260, 55, color(255, 0, 255)));
}

// -----------------------------
// DRAW — movement + animation
// -----------------------------
function draw() {
  background(50);

  let moving = false;

  if (keyIsDown(LEFT_ARROW)) {
    charX -= charSpeed;
    moving = true;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    charX += charSpeed;
    moving = true;
  }

  updateAnimation();
  drawCharacter();

  // Draw all food
  for (let f of foods) {
    f.display();
  }
}

// -----------------------------
// Update animation frame
// -----------------------------
function updateAnimation() {
  frameTimer++;

  if (frameTimer >= frameDelay) {
    frameTimer = 0;
    frameIndex++;

    if (frameIndex >= danceFrames.length) {
      frameIndex = 0; // loop
    }
  }
}

// -----------------------------
// Draw character
// -----------------------------
function drawCharacter() {
  let img = danceFrames[frameIndex];
  imageMode(CENTER);
  image(img, charX, charY);
}
