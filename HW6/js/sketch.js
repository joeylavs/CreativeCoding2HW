let idleFrames = [];
let walkFrames = [];
let currentAnimation = "idle";
let frameIndex = 0;
let frameTimer = 0;
let frameDelay = 8; // bigger = slower

let charX = 200;
let charY = 200;
let charSpeed = 2;

function preload() {
  for (let i = 0; i < 3; i++) {
    idleFrames.push(loadImage(`images/idle_${i}.png`));
  }
  for (let i = 0; i < 4; i++) {
    walkFrames.push(loadImage(`images/walk_${i}.png`));
  }
}
let foods = [];
function setup() {
  createCanvas(600, 400);

  foods.push(new Food(100, 300, 40, color(255, 0, 0)));
  foods.push(new Food(200, 250, 60, color(0, 255, 0)));
  foods.push(new Food(300, 320, 50, color(0, 0, 255)));
  foods.push(new Food(400, 280, 70, color(255, 165, 0)));
  foods.push(new Food(500, 260, 55, color(255, 0, 255)));
}
