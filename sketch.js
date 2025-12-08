// Rubik's Cube Simlator/Solve Timer
// Graham Lindsay
// January 19th, 2025

let cube;
let cubeArray = [];
let piece;
let cubeSize = 3;
let pieceSize = 300/cubeSize;
let moves = ["U", "D", "F", "B", "L", "R", "U'", "D'", "F'", "B'", "L'", "R'"];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  strokeWeight(6);
  debugMode();
  angleMode(DEGREES);

  // back face culling.
  drawingContext.enable(drawingContext.CULL_FACE);
  drawingContext.cullFace(drawingContext.FRONT);

  camera(500, -500, 500, 0, 0, 0, 0, 1, 0);

  cube = new Cube(cubeSize);
  cube.generateCube();
  // cube.scramble();
}

function draw() {
  background(100);
  orbitControl();
  cube.display();
}

class Piece {
  constructor(x, y, z, xTranslation, yTranslation, zTranslation, xRotation, yRotation, zRotation) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.xTranslation = xTranslation;
    this.yTranslation = yTranslation;
    this.zTranslation = zTranslation;
    this.xRotation = xRotation;
    this.yRotation = yRotation;
    this.zRotation = zRotation;
    this.piece = buildGeometry(this.createPiece);
  }

  display() { // display the piece and perform rotations & translations.
    resetMatrix();
    rotateX(this.xRotation);
    rotateY(this.yRotation);
    rotateZ(this.zRotation);
    translate(this.xTranslation, this.yTranslation, this.zTranslation);
    translate(-100, -100, -100);
    model(this.piece);
  }

  createPiece() { // create the design for a single piece.
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
}

class Cube {
  constructor(cubeSize) {
    this.cubeSize = cubeSize;
  }

  generateCube() {
    for (let z = 0; z < this.cubeSize; z++) {
      cubeArray.push([]);
      for (let y = 0; y < this.cubeSize; y++) {
        cubeArray[z].push([]);
        for (let x = 0; x < this.cubeSize; x++) {
          cubeArray[z][y].push(new Piece(x * pieceSize, y * pieceSize, z * pieceSize, x * pieceSize, y * pieceSize, z * pieceSize, 0, 0, 0));
        }
      }
    }
  }

  display() {
    for (let z = 0; z < this.cubeSize; z++) {
      for (let y = 0; y < this.cubeSize; y++) {
        for (let x = 0; x < this.cubeSize; x++) {
          cubeArray[z][y][x].display();
        }
      }
    }
  }

  scramble() {
    let scramble = "";
    for (let i = 0; i < 30; i++) {
      let side = random(moves);
      turnSide(side);
      scramble = scramble + side + " ";
    }
    console.log(scramble);
  }
}

function keyPressed() {
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
  if (keyIsDown(83)) {
    cube.scramble();
  }
}

// turn a specific side.
function turnSide(side) {
  for (let z = 0; z < cubeSize; z++) {
    for (let y = 0; y < cubeSize; y++) {
      for (let x = 0; x < cubeSize; x++) {
        let somePiece = cubeArray[z][y][x];
        if (side === "U") {
          if (somePiece.y === 0) {
            if (somePiece.z === 0) {
              somePiece.z = somePiece.x;
              somePiece.x = 200;
            }
            else if (somePiece.z === 100) {
              somePiece.z = somePiece.x;
              somePiece.x = 100;
            }
            else if (somePiece.z === 200) {
              somePiece.z = somePiece.x;
              somePiece.x = 0;
            }

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
        if (side === "U'") {
          if (somePiece.y === 0) {
            somePiece.yRotation += 90;
          }
        }
      }
    }
  }
}