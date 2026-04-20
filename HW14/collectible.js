class Collectible {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
  }

  display() {
    fill(50, 200, 255);
    ellipse(this.x, this.y, this.size);
  }

  collected(player) {
    return dist(this.x, this.y, player.x, player.y) < (this.size + player.size) / 2;
  }
}

