// Rubik's Cube Simlator/Solve Timer
// Graham Lindsay
// January 19th, 2025

let cube;
let cubeArray = [];
let piece;
let cubeSize = 3;
let pieceSize = 300 / cubeSize;
let moves = ["u", "d", "f", "b", "l", "r", "u'", "d'", "f'", "b'", "l'", "r'"];
let font;
let cam;
let timerStarted = false;
let timerReady = false;

function preload() {
  font = loadFont("ARIALBD.TTF");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  strokeWeight(8);
  // debugMode();
  angleMode(DEGREES);

  // back face culling.
  drawingContext.enable(drawingContext.CULL_FACE);
  drawingContext.cullFace(drawingContext.FRONT);

  camera(500, -500, 500, 0, 0, 0, 0, 1, 0);

  textFont(font);
  textSize(100);
  textAlign(CENTER, TOP);

  cube = new Cube();
  cube.generate();
  // cube.scramble()
}

function draw() {
  background(211);
  orbitControl();
  cube.display();
  cube.countdown();
}

class Piece {
  constructor(x, y, z, xRotation, yRotation, zRotation) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.xTranslation = x * pieceSize;
    this.yTranslation = y * pieceSize;
    this.zTranslation = z * pieceSize;
    this.xRotation = xRotation;
    this.yRotation = yRotation;
    this.zRotation = zRotation;
  }

  display() { // display the piece and perform rotations & translations.
    resetMatrix();
    rotateX(this.xRotation);
    rotateY(this.yRotation);
    rotateZ(this.zRotation);
    translate(this.xTranslation, this.yTranslation, this.zTranslation);
    translate(-100, -100, -100);
    this.createPiece();
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
  constructor() {
    this.countdownTimer = 0;
    this.milliseconds = 0;
    this.seconds = 0;
    this.minutes = 0;
  }

  generate() {
    for (let z = 0; z < cubeSize; z++) {
      for (let y = 0; y < cubeSize; y++) {
        for (let x = 0; x < cubeSize; x++) {
          cubeArray.push(new Piece(x, y, z, 0, 0, 0));
        }
      }
    }
  }

  display() {
    for (let somePiece of cubeArray) {
      somePiece.display();
    }
  }

  turnSide(side) {
    for (let somePiece of cubeArray) {
      if (side === "u" && somePiece.y === 0) {
        let nx = cubeSize - 1 - somePiece.z;
        let nz = somePiece.x;
        somePiece.x = nx;
        somePiece.z = nz;
        somePiece.yRotation -= 90;
      }
      if (side === "d" && somePiece.y === 2) {
        let nx = somePiece.z;
        let nz = cubeSize - 1 - somePiece.x;
        somePiece.x = nx;
        somePiece.z = nz;
        somePiece.yRotation += 90;
      }
      if (side === "f" && somePiece.z === 2) {
        let nx = cubeSize - 1 - somePiece.y;
        let ny = somePiece.x;
        somePiece.x = nx;
        somePiece.y = ny;
        somePiece.zRotation += 90;
      }
      if (side === "b" && somePiece.z === 0) {
        let nx = somePiece.y;
        let ny = cubeSize - 1 - somePiece.x;
        somePiece.x = nx;
        somePiece.y = ny;
        somePiece.zRotation -= 90;
      }
      if (side === "l" && somePiece.x === 0) {
        let nz = somePiece.y;
        let ny = cubeSize - 1 - somePiece.z;
        somePiece.z = nz;
        somePiece.y = ny;
        somePiece.xRotation -= 90;
      }
      if (side === "r" && somePiece.x === 2) {
        let nz = cubeSize - 1 - somePiece.y;
        let ny = somePiece.z;
        somePiece.z = nz;
        somePiece.y = ny;
        somePiece.xRotation += 90;
      }
    }
  }

  scramble() {
    let scramble = "";
    let scrambleLength = random(6, 25);
    for (let i = 0; i < scrambleLength; i++) {
      let side = random(moves);
      this.turnSide(side);
      scramble = scramble + side + " ";
    }
    console.log(scramble.toUpperCase());
    // resetMatrix();
    // translate(0 -400, 0);
    // text("Scramble: " + scramble, 0, 0);
  }


  countdown() {
    resetMatrix();
    rotateY(180);

    if (keyIsDown(32) && !timerStarted) {
      timerReady = false;
      this.countdownTimer++;
      if (this.countdownTimer <= 75) {
        push();
        fill(255, 25, 0);
        translate(0, -400, 0);
        text("0.00", 0, 0);
        pop();
      }
      else {
        push();
        fill(56, 235, 0);
        translate(0, -400, 0);
        text("0.00", 0, 0);
        pop();
        timerReady = true;
      }
    }
    else if (timerReady) {
      this.startTimer();
    }
    else {
      this.countdownTimer = 0;
    }
  }

  startTimer() {
    resetMatrix();
    rotateY(180);
    timerStarted = true;
    this.milliseconds++;
    if (this.milliseconds === 100) {
      this.seconds++;
      this.milliseconds = 0;
    }
    if (this.seconds === 60) {
      this.minutes++;
      this.seconds = 0;
    }

    push();
    fill(56, 235, 0);
    translate(0, -400, 0);
    text(this.minutes + ":" + this.seconds + "." + this.milliseconds, 1, 0, 0);
    pop();
  }

  stopTimer() {
    // stop timer
    console.log(this.minutes + ":" + this.seconds + "." + this.milliseconds);
  }
}

function keyPressed() {
  cube.turnSide(key);

  if (key === "s") {
    cube.scramble();
  }
  if (key === " ") {
    if (timerStarted) {
      cube.stopTimer();
    }
  }
  if (key === "e") {
    camera(500, -500, 500, 0, 0, 0, 0, 1, 0);
  }
}