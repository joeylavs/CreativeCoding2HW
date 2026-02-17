
// FOOD ARRAYS

let foodX = [];
let foodY = [];
let foodCount = 10; // number of pizzas on screen


// ANIMATION ARRAYS

let frames = [];
let totalFrames = 4; // change this to match your images
let frameIndex = 0;

function preload() {
  // Load animation frames from images folder
  for (let i = 0; i < totalFrames; i++) {
    frames[i] = loadImage(`images/frame_${i}.png`);
  }
}

function setup() {
  createCanvas(600, 400);

  // Create random pizza positions
  for (let i = 0; i < foodCount; i++) {
    foodX[i] = random(width);
    foodY[i] = random(height);
  }
}

function draw() {
  background(230);

  
  // DRAW MULTIPLE PIZZAS
  
  for (let i = 0; i < foodCount; i++) {
    drawPizza(foodX[i], foodY[i]);
  }

  
  // DRAW ANIMATION
  
  image(frames[frameIndex], 400, 200, 120, 120);
  
// slow down animation counter++; if (counter % animationSpeed === 0) { frameIndex++; if (frameIndex >= frames.length) { frameIndex = 0; } }
 let animationSpeed = 10;

  // Cycle animation frames
  


// SIMPLE PIZZA DRAWING FUNCTION

function drawPizza(x, y) {
  push();
  translate(x, y);

  // crust
  fill(210, 160, 80);
  circle(0, 0, 40);

  // sauce
  fill(200, 50, 50);
  circle(0, 0, 30);

  // cheese
  fill(255, 220, 100);
  circle(0, 0, 25);

  pop();
}
