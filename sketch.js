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
  debugMode();
  angleMode(DEGREES);

  // back face culling.
  drawingContext.enable(drawingContext.CULL_FACE);
  drawingContext.cullFace(drawingContext.FRONT);

  camera(500, -500, 500, pieceSize, pieceSize, pieceSize, 0, 1, 0);
}

function draw() {
  background(100);
  for (let somePiece of cube) {
    if (keyIsDown(85)) {
      turnSide("U");
    }
    if (keyIsDown(68)) {
      turnSide("D");
    }
    if (keyIsDown(70)) {
      turnSide("F");
    }
    if (keyIsDown(66)) {
      turnSide("B");
    }
    if (keyIsDown(76)) {
      turnSide("L");
    }
    if (keyIsDown(82)) {
      turnSide("R");
    }
    somePiece.display();
  }
  orbitControl();
}

class Piece {
  constructor(x, y, z, xRotation, yRotation, zRotation) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.xRotation = xRotation;
    this.yRotation = yRotation;
    this.zRotation = zRotation;
    this.piece = buildGeometry(createPiece);
  }

  display() { // creates a piece made up of 6 different boxes of different colours that are offset to make each side of the piece a different colour.
    resetMatrix();
    translate(this.x, this.y, this.z);
    rotateX(this.xRotation);
    rotateY(this.yRotation);
    rotateZ(this.zRotation);
    model(this.piece);
  }
}

function generateCube() {
  for (let z = 0; z < cubeSize; z++) {
    for (let y = 0; y < cubeSize; y++) {
      for (let x = 0; x < cubeSize; x++) {
        cube.push(new Piece(x * pieceSize, y * pieceSize, z * pieceSize, 0, 0, 0));
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

function turnSide(side) {
  for (let somePiece of cube) {
    if (side === "U") {
      if (somePiece.y === 0) {
        somePiece.yRotation += 270;
      }
    }
    if (side === "D") {
      if (somePiece.y === 200) {
        somePiece.yRotation += 90;
      }
    }
    if (side === "F") {
      if (somePiece.z === 200) {
        somePiece.zRotation += 90;
      }
    }
    if (side === "B") {
      if (somePiece.z === 0) {
        somePiece.zRotation += 270;
      }
    }
    if (side === "L") {
      if (somePiece.x === 0) {
        somePiece.xRotation += 270;
      }
    }
    if (side === "R") {
      if (somePiece.x === 200) {
        somePiece.xRotation += 90;
      }
    }
  }
}