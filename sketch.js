let squares = [];

function makeSquare() {
  return {
    x: random(width),
    y: random(height),
    size: random(20, 40),
    dx: random(-2, 2),
    dy: random(-2, 2)
  };
}

function setup() {
  createCanvas(600, 400);

  // start with a few squares
  for (let i = 0; i < 5; i++) {
    squares.push(makeSquare());
  }
}

function draw() {
  background(220);

  // move + draw squares
  for (let s of squares) {
    s.x += s.dx;
    s.y += s.dy;

    // bounce off edges
    if (s.x < 0 || s.x + s.size > width) s.dx *= -1;
    if (s.y < 0 || s.y + s.size > height) s.dy *= -1;

    fill(100, 150, 255);
    rect(s.x, s.y, s.size, s.size);
  }

  // title + name
  fill(0);
  textSize(20);
  text("Moving Squares", 10, 30);

  textSize(14);
  textAlign(RIGHT, BOTTOM);
  text("Joey", width - 10, height - 10);
  textAlign(LEFT, BASELINE);
}

function mousePressed() {
  squares.push(makeSquare());
}

