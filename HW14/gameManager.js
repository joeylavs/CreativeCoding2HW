class GameManager {
  constructor() {
    this.state = "playing"; // playing, win, lose
    this.collected = 0;
    this.totalCollectibles = 5;
  }

  update() {
  
  }

  display() {
    // UI text
    fill(255);
    textSize(20);
    textAlign(LEFT);

    text("Health: " + player.health, 20, 30);
    text("Score: " + player.score, 20, 60);
    text("Gems: " + this.collected + " / " + this.totalCollectibles, 20, 90);

    // Win/Lose screens
    if (this.state === "win") {
      this.showWinScreen();
    } else if (this.state === "lose") {
      this.showLoseScreen();
    }
  }

  checkWinLose(player) {
    if (player.health <= 0) {
      this.state = "lose";
    }

    if (this.collected >= this.totalCollectibles) {
      this.state = "win";
    }
  }

  showWinScreen() {
    fill(0, 200, 0);
    textAlign(CENTER);
    textSize(40);
    text("YOU ESCAPED THE DUNGEON!", width / 2, height / 2);
    textSize(20);
    text("Refresh the page to play again", width / 2, height / 2 + 40);
  }

  showLoseScreen() {
    fill(200, 0, 0);
    textAlign(CENTER);
    textSize(40);
    text("YOU WERE CAUGHT!", width / 2, height / 2);
    textSize(20);
    text("Refresh the page to try again", width / 2, height / 2 + 40);
  }
}

