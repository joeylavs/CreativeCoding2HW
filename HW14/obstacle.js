class Obstacle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.speed = 1.5;

    // Randomly choose AI type
    this.type = random(["patrol", "chase"]);

    // Patrol points
    this.pointA = createVector(this.x, this.y);
    this.pointB = createVector(
      this.x + random(-100, 100),
      this.y + random(-100, 100)
    );
    this.target = this.pointB.copy();
  }

  update(player) {
    if (this.type === "chase") {
      this.chase(player);
    } else {
      this.patrol();
    }
  }

  chase(player) {
    let dir = createVector(player.x - this.x, player.y - this.y);
    dir.normalize();
    dir.mult(this.speed);
    this.x += dir.x;
    this.y += dir.y;
  }

  patrol() {
    let dir = createVector(this.target.x - this.x, this.target.y - this.y);
    dir.normalize();
    dir.mult(this.speed);
    this.x += dir.x;
    this.y += dir.y;

    // Switch target when close
    if (dist(this.x, this.y, this.target.x, this.target.y) < 5) {
      this.target = this.target === this.pointA ? this.pointB : this.pointA;
    }
  }

  display() {
  imageMode(CENTER);
  image(guardImg, this.x, this.y, this.size, this.size);
}


  hits(player) {
    return dist(this.x, this.y, player.x, player.y) < (this.size + player.size) / 2;
  }
}

