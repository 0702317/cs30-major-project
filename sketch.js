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
  // debugMode();
  angleMode(DEGREES);
}

function draw() {
  background(100);
  for (let somePiece of cube) {
    somePiece.display();
    // translate(somePiece.x, somePiece.y, somePiece.z);
  }
  orbitControl();
}

class Piece {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
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

function generateCube() {
  for (let z = 0; z < cubeSize; z++) {
    for (let y = 0; y < cubeSize; y++) {
      for (let x = 0; x < cubeSize; x++) {
        let piece = new Piece(x +100, y+100, z+100);
        cube.push(piece);
      }
    }
  }
}
