class MazeWall {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display() {
    fill(120, 120, 150);
    rect(this.x, this.y, this.w, this.h);
  }

  hits(player) {
    return (
      player.x + player.size / 2 > this.x &&
      player.x - player.size / 2 < this.x + this.w &&
      player.y + player.size / 2 > this.y &&
      player.y - player.size / 2 < this.y + this.h
    );
  }
}
