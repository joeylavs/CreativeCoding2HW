let imgPhoto, imgDrawing, imgAI;
let titleFont;

let aiX = 100;
let aiSpeed = 40;

function preload() {
  imgPhoto   = loadImage('images/pizza.jpg');
  imgDrawing = loadImage('images/PizzaSteve.webp');
  imgAI      = loadImage('images/AIpizza.png');
  titleFont  = loadFont('assets/titleFont.ttf');
}

function setup() {
  createCanvas(800, 500);
  imageMode(CENTER);

  // Timer-based movement
  setInterval(() => {
    aiX += aiSpeed;
    if (aiX > width - 80 || aiX < 80) {
      aiSpeed *= -1; // bounce
    }
  }, 300); // moves every 0.3 seconds
}

function draw() {
  background(255, 230, 180); // pizza crust color

  // Real pizza photo
  image(imgPhoto, width * 0.25, height * 0.55, 260, 260);

  // Cartoon pizza
  image(imgDrawing, width * 0.75, height * 0.55, 220, 220);

  // AI pizza slice bouncing
  image(imgAI, aiX, 150, 180, 180);

  drawText();
}

function drawText() {
  textFont(titleFont);
  textAlign(CENTER, CENTER);

  fill(120, 40, 0);
  textSize(48);
  text("Pizza Party!", width / 2, 60);

  textSize(24);
  text("by Joey", width / 2, height - 40);
}

