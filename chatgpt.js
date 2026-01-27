function setup() {
  createCanvas(400, 400);
  background(240);
}

function draw() {
  // Face
  fill(255, 220, 0);
  noStroke();
  ellipse(200, 200, 250, 250);

  // Eyes
  fill(0);
  ellipse(160, 170, 30, 40);
  ellipse(240, 170, 30, 40);

  // Smile
  noFill();
  stroke(0);
  strokeWeight(6);
  arc(200, 220, 120, 80, 0, PI);
}
