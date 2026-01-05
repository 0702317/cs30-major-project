// Rubik's Cube Simlator/Solve Timer
// Graham Lindsay
// January 19th, 2025

let cube;
let cubeArray = [];
let c = [];
let piece;
let cubeSize = 3;
let pieceSize = 300/cubeSize;
let turns = 0;
let moves = ["U", "D", "F", "B", "L", "R", "U'", "D'", "F'", "B'", "L'", "R'"];
let font;
let cam;

function preload() {
  font = loadFont("ARIALBD.TTF");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  strokeWeight(6);
  debugMode();
  angleMode(DEGREES);

  // back face culling.
  drawingContext.enable(drawingContext.CULL_FACE);
  drawingContext.cullFace(drawingContext.FRONT);

  camera(500, -500, 500, 0, 0, 0, 0, 1, 0);

  textFont(font);
  textSize(100);
  textAlign(CENTER, TOP);
  
  cube = new Cube(cubeSize);
  cube.generateCube();
  // cube.scramble();
}

function draw() {
  background(100);
  orbitControl();
  cube.display();
  cube.startTimer();
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
    this.timer = 0;
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

    for (let z = 0; z < this.cubeSize; z++) {
      for (let y = 0; y < this.cubeSize; y++) {
        for (let x = 0; x < this.cubeSize; x++) {
          c.push(new Piece(x, y, z, x, y, z, 0, 0, 0));
        }
      }
    }

  }

  turnSide(side) {
    for (let z = 0; z < cubeSize; z++) {
      for (let y = 0; y < cubeSize; y++) {
        for (let x = 0; x < cubeSize; x++) {
          let somePiece = cubeArray[z][y][x];
          if (side === "U") {
            if (somePiece.y === 0) {
              somePiece.yRotation -= 90;
            }
          }
          if (side === "D") {
            if (somePiece.y === 200) {
              somePiece.yRotation += 90;
            }
          }
          else if (side === "F") {
            if (somePiece.z === 200) {
              somePiece.zRotation += 90;
            }
          }
          else if (side === "B") {
            if (somePiece.z === 0) {
              somePiece.zRotation -= 90;
            }
          }
          else if (side === "L") {
            if (somePiece.x === 0) {
              somePiece.xRotation -= 90;
            }
          }
          else if (side === "R") {
            if (somePiece.x === 200) {
              somePiece.xRotation += 90;
            }
          }
        }
      }
    }
  }
  
  scramble() {
    let scramble = "";
    for (let i = 0; i < 30; i++) {
      let side = random(moves);
      this.turnSide(side);
      scramble = scramble + side + " ";
    }
    console.log(scramble);
    // resetMatrix();
    // translate(0 -400, 0);
    // text("Scramble: " + scramble, 0, 0);
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

  startTimer() {
    resetMatrix();
    rotateY(180);

    if (keyIsDown(32)) {
      this.timer++;
      if (this.timer <= 80) {
        translate(0, -400, 0);
        text("3", 0, 0);
      }
      else if (this.timer <= 160) {
        translate(0, -400, 0);
        text("2", 0, 0);
      }
      else if (this.timer <= 240) {
        translate(0, -400, 0);
        text("1", 0, 0);
      }
      else if (this.timer <= 320) {
        translate(0, -400, 0);
        text("GO!", 0, 0);
      }
      else {
        translate(0, -400, 0);
        text("", 0, 0);
      }
    }
    else {
      this.timer = 0;
    }
  }
}

function keyPressed() {
  if (keyIsDown(85)) {
    cube.turnSide("U");
  }
  if (keyIsDown(68)) {
    cube.turnSide("D");
  }
  if (keyIsDown(70)) {
    cube.turnSide("F");
  }
  if (keyIsDown(66)) {
    cube.turnSide("B");
  }
  if (keyIsDown(76)) {
    cube.turnSide("L");
  }
  if (keyIsDown(82)) {
    cube.turnSide("R");
  }
  if (keyIsDown(83)) {
    cube.scramble();
  }
}