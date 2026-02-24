class Food {
  constructor(x, y, size, col) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.col = col;
  }

  display() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(this.col);

    // shape 1: main body (circle)
    ellipse(0, 0, this.size);

    // shape 2: topping (rectangle)
    fill(255, 255, 0);
    rectMode(CENTER);
    rect(0, -this.size * 0.2, this.size * 0.6, this.size * 0.2);

    pop();
  }
}

