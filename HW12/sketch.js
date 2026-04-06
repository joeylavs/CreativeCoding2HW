let angle = 0;
let textG;

function setup() {
  createCanvas(800, 600, WEBGL);

  // Create text texture
  textG = createGraphics(400, 200);
  textG.pixelDensity(1);
  textG.background(10);
  textG.textAlign(CENTER, CENTER);
  textG.textSize(40);
  textG.fill(255);
  textG.text("Pizza Planet", 200, 100);
}

function draw() {
  background(15);
  orbitControl();

  ambientLight(80);
  directionalLight(255, 255, 255, 0.5, -1, -0.5);

  angle += 0.01;

  // --- central pizza ---
  push();
  rotateX(HALF_PI);
  rotateZ(angle * 0.3);
  ambientMaterial(230, 190, 120);
  cylinder(120, 20, 32, 1);
  pop();

  // --- cheese chunk ---
  push();
  rotateY(angle * 0.7);
  translate(80, -20, 0);
  ambientMaterial(255, 230, 120);
  box(40, 10, 40);
  pop();

  // --- pepperoni ---
  push();
  rotateY(angle * 1.2);
  translate(60, -10, -60);
  ambientMaterial(180, 40, 40);
  cylinder(20, 8, 24, 1);
  pop();

  // --- olive ---
  push();
  rotateY(angle * 1.5);
  translate(0, -5, 100);
  normalMaterial();
  torus(18, 6, 24, 16);
  pop();

  // --- background sphere ---
  push();
  translate(-200, -150, -300);
  rotateY(angle * 0.4);
  specularMaterial(80, 120, 255);
  sphere(70, 32, 32);
  pop();

  // --- rotating Pizza Planet sign ---
  push();
  translate(0, -200, 0);
  rotateY(angle * 0.6);
  rotateX(-0.3);
  texture(textG);
  box(260, 120, 10);
  pop();
}
