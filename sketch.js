function setup() {
  createCanvas(600, 400);
  noStroke();
}

function draw() {
  background(220);

  // Example shapes — replace these with your own design
  fill(240);
  ellipse(300, 250, 300, 120); // plate

  fill(200, 150, 80);
  ellipse(300, 240, 220, 80); // food base

  fill(0, 150, 0);
  ellipse(250, 220, 20, 20); // garnish
  ellipse(350, 220, 20, 20); // garnish
}
