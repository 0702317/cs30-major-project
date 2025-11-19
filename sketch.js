// Rubik's Cube Simlator/Solve Timer
// Graham Lindsay
// January 19th, 2025

// I am going to have to use squares for each side of the piece because they are different colours.
let cube;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cube = new Piece(0, 0, "corner", color(255, 255, 0));

  debugMode();
}

function draw() {
  background(220);
  cube.display();
  orbitControl();
}

class Piece {
  constructor(x, y, type, color) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
  }
  
  display() {
    fill(this.color);
    box(100, 100, 100);
  }

  move() {

  }
}