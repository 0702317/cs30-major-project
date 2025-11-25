// Rubik's Cube Simlator/Solve Timer
// Graham Lindsay
// January 19th, 2025

let cube = [];
let piece;
let cubeSize = 3;
let pieceSize = 300/cubeSize;
let moves = ["U", "D", "F", "B", "L", "R"];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  strokeWeight(4);
  generateCube();
  // debugMode();
  angleMode(DEGREES);

  // back face culling.
  drawingContext.enable(drawingContext.CULL_FACE);
  drawingContext.cullFace(drawingContext.FRONT);

  camera(500, -500, 500, pieceSize, pieceSize, pieceSize, 0, 1, 0);
}

function draw() {
  background(100);
  for (let somePiece of cube) {
    somePiece.display();
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
    resetMatrix();
    translate(this.x, this.y, this.z);
    piece = buildGeometry(createPiece);
    model(piece);
  }

  turn() {

  }
}

function generateCube() {
  for (let z = 0; z < cubeSize; z++) {
    for (let y = 0; y < cubeSize; y++) {
      for (let x = 0; x < cubeSize; x++) {
        cube.push(new Piece(x * pieceSize, y * pieceSize, z * pieceSize));
      }
    }
  }
}

function createPiece() { // design for a piece
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
}