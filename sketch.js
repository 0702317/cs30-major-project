// Rubik's Cube Simlator/Solve Timer
// Graham Lindsay
// January 19th, 2025


let cube = [];
let piece;
let cubeSize = 3;
let pieceSize = 100;
let moves = ["U", "D", "F", "B", "L", "R"];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  generateCube();
  debugMode();
  angleMode(DEGREES);
}

function draw() {
  background(220);
  for (let somePiece of cube) {
    somePiece.display();
  }
  orbitControl();
}

class Piece {
  constructor(x, y, z) {
    this.x = x * pieceSize;
    this.y = y * pieceSize;
    this.z = z * pieceSize;
  }
  
  display() { // creates a piece made up of 6 different boxes of different colours that are offset to make each side of the piece a different colour.
    strokeWeight(4);
    push();
    translate(0, -3, 0);
    fill("white");
    box(pieceSize);
    pop();
    push();
    translate(0, 3, 0);
    fill("yellow");
    box(pieceSize);
    pop();
    push();
    translate(3, 0, 0);
    fill("orange");
    box(pieceSize);
    pop();
    push();
    translate(-3, 0, 0);
    fill("red");
    box(pieceSize);
    pop();
    push();
    translate(0, 0, 3);
    fill("green");
    box(pieceSize);
    pop();
    push();
    translate(0, 0, -3);
    fill("blue");
    box(pieceSize);
    pop();
    translate(this.x, this.y, this.z);
  }
}

// class Edge extends Piece {
//   constructor(x, y, color) {
//     super(x, y, color);
//     this.type = "edge";
//   }
// }

// class Corner extends Piece {
//   constructor(x, y, color) {
//     super(x, y, color);
//     this.type = "corner";
//   }
// }

function generateCube() {
  // for (let z = 0; z < 3; z++) {
  //   for (let y = 0; y < 3; y++) {
  //     for (let x = 0; x < 3; x++) {
  //       piece = new Piece(x, y, z);
  //       cube.push(piece);
  //     }
  //   }
  // }

  piece = new Piece(0, 0, 0);
  cube.push(piece);
}
