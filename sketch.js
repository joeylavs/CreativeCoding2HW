function setup() {
  createCanvas(400, 400);
  background(255);
  noStroke();
}

function draw() {
  background(255);

  // Face circle
  fill(255, 230, 0);
  ellipse(200, 200, 250, 250);

  // Eyes
  fill(0);
  ellipse(160, 170, 35, 35);
  ellipse(240, 170, 35, 35);

  // Smile
  noFill();
  stroke(0);
  strokeWeight(8);
  arc(200, 220, 150, 120, 0, PI);
}
