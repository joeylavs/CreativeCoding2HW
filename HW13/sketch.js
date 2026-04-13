let ambulance;
let textures = [];
let numShapes = 5;

let shapePositions = [];
let shapeSpeeds = [];
let shapeTypes = [];
let shapeTextures = [];

function preload() {
  // Load your ambulance model
  ambulance = loadModel('assets/ambulance.obj', true);

  // Load your two textures
  textures[0] = loadImage('assets/texture1.jpg');
  textures[1] = loadImage('assets/texture2.jpg');
}

function setup() {
  createCanvas(800, 600, WEBGL);

  // Initialize 5 orbiting shapes
  for (let i = 0; i < numShapes; i++) {
    shapePositions[i] = createVector(
      random(-200, 200),
      random(-200, 200),
      random(-200, 200)
    );

    shapeSpeeds[i] = random(0.01, 0.03);

    let types = ['box', 'sphere', 'cone', 'cylinder', 'torus'];
    shapeTypes[i] = types[i % types.length];

    // Cycle between your two textures
    shapeTextures[i] = textures[i % 2];
  }
}

function draw() {
  background(10);
  orbitControl();

  ambientLight(100);
  directionalLight(255, 255, 255, 0.5, -1, -0.5);

  // Draw ambulance model
  push();
  rotateY(frameCount * 0.01);
  scale(1.2);

  // If ambulance loads sideways, uncomment:
  // rotateX(HALF_PI);
  // rotateZ(PI);

  normalMaterial();
  model(ambulance);
  pop();

  // Draw orbiting textured shapes
  for (let i = 0; i < numShapes; i++) {
    push();

    let a = frameCount * shapeSpeeds[i];
    let orbitRadius = 300;

    let px = shapePositions[i].x + cos(a) * orbitRadius;
    let py = shapePositions[i].y + sin(a) * orbitRadius;
    let pz = shapePositions[i].z;

    translate(px, py, pz);

    rotateX(a * 1.2);
    rotateY(a * 1.5);

    texture(shapeTextures[i]);

    switch (shapeTypes[i]) {
      case 'box':
        box(60);
        break;
      case 'sphere':
        sphere(40, 24, 16);
        break;
      case 'cone':
        cone(40, 80, 24, 16);
        break;
      case 'cylinder':
        cylinder(30, 80, 24, 16);
        break;
      case 'torus':
        torus(40, 15, 24, 16);
        break;
    }

    pop();
  }

  // Title + Name
  push();
  resetMatrix();
  translate(-width / 2 + 20, -height / 2 + 40);
  fill(255);
  textSize(24);
  text("3D Ambulance Orbit Scene", 0, 0);
  textSize(16);
  text("By Joey Lavs", 0, 30);
  pop();
}

// Move two shapes on click
function mousePressed() {
  for (let i = 0; i < 2; i++) {
    let idx = floor(random(numShapes));
    shapePositions[idx] = createVector(
      random(-200, 200),
      random(-200, 200),
      random(-200, 200)
    );
  }
}

