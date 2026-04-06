let angle = 0;
let textG;

function setup() {
  createCanvas(800, 600, WEBGL);

  // offscreen graphics for text texture
  textG = createGraphics(400, 200);
  textG.pixelDensity(1);
  textG.background(10);
  textG.textAlign(CENTER, CENTER);
  textG.textSize(28);
  textG.fill(255);
  textG.text("3D Pizza Orbit\nby Joey", 200, 100);
}

function draw() {
  background(15);

  // basic camera-ish feel
  orbitControl();

  // global light
  ambientLight(80);
  directionalLight(255, 255, 255, 0.5, -1, -0.5);

  angle += 0.01;

  // --- central pizza (cylinder) ---
  push();
  rotateX(HALF_PI);          // lay it flat
  rotateZ(angle * 0.3);      // slow spin
  ambientMaterial(230, 190, 120); // crust color
  cylinder(120, 20, 32, 1);  // radius, height
  pop();

  // --- cheese box chunks ---
  push();
  rotateY(angle * 0.7);
  translate(80, -20, 0);
  ambientMaterial(255, 230, 120);
  box(40, 10, 40);
  pop();

  push();
  rotateY(-angle * 0.5);
  translate(-90, -15, 40);
  ambientMaterial(255, 230, 120);
  box(30, 10, 30);
  pop();

  // --- pepperoni cylinders ---
  push();
  rotateY(angle * 1.2);
  translate(60, -10, -60);
  ambientMaterial(180, 40, 40);
  cylinder(20, 8, 24, 1);
  pop();

  push();
  rotateY(angle * 0.9);
  translate(-40, -10, -80);
  ambientMaterial(180, 40, 40);
  cylinder(18, 8, 24, 1);
  pop();

  // --- olive torus ---
  push();
  rotateY(angle * 1.5);
  translate(0, -5, 100);
  normalMaterial(); // fun rainbow shading
  torus(18, 6, 24, 16);
  pop();

  // --- background planet sphere ---
  push();
  translate(-200, -150, -300);
  rotateY(angle * 0.4);
  specularMaterial(80, 120, 255);
  sphere(70, 32, 32);
  pop();

  // --- rotating text sign ---
  push();
  translate(0, -200, 0);
  rotateY(angle * 0.6);
  rotateX(-0.3);
  texture(textG);
  box(260, 120, 10);
  pop();
}
