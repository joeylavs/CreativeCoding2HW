class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 3;
    this.health = 3;
    this.score = 0;
    this.size = 30;
  }

  update() {
this.prevX = this.x;
this.prevY = this.y;
    if (keyIsDown(87)) this.y -= this.speed; // W
    if (keyIsDown(83)) this.y += this.speed; // S
    if (keyIsDown(65)) this.x -= this.speed; // A
    if (keyIsDown(68)) this.x += this.speed; // D

    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

display() {
  imageMode(CENTER);
  image(thiefImg, this.x, this.y, this.size, this.size);
}

}

