// Rubik's Cube Simlator/Solve Timer
// Graham Lindsay
// January 19th, 2025

// I am going to have to use squares for each side of the piece because they are different colours.
let cube = [];
let piece;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  piece = new Piece(0, 0, "corner", color(255, 255, 0));

  debugMode();
  angleMode(DEGREES);
}

function draw() {
  background(220);
  piece.display();
  orbitControl();
  if (keyIsPressed) {
    piece.move();
    piece.display();
  }
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
    
    rotateY(45);
  }
}

class Edge extends Piece {
  constructor() {
  
  }
}

class Corner extends Piece {
  constructor() {
  
  }
}
