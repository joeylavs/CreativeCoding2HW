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
