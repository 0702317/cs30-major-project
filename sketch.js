// Rubik's Cube Simlator/Solve Timer
// Graham Lindsay
// January 19th, 2025

let cube;
let cubeArray = [];
let piece;
let cubeSize = 3;
let pieceSize = 300 / cubeSize;
let moves = ["u", "d", "f", "b", "l", "r", "u'", "d'", "f'", "b'", "l'", "r'"];
let scramble = "";
let font;
let cam;
let timerStarted = false;
let timerReady = false;
let turnSound;
let music;

function preload() {
  font = loadFont("assets/ARIALBD.TTF");
  turnSound = loadSound("assets/rubiks_cube_turn.mp3");
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
  textAlign(CENTER, CENTER);

  turnSound.setVolume(0.25);

  cube = new Cube();
  cube.generate();
  // cube.scramble()
}

function draw() {
  background(211);
  orbitControl();
  cube.display();
  cube.countdown();
  push();
  resetMatrix();
  translate(0, 500, 0);
  fill(0);
  rotateY(180);
  text(scramble, 0, 0);
  pop();
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

  // rotate(side, angle) {
  //   push();
  //   if (side === "u") {
  //     rotateY(angle);
  //   }
  //   if (side === "d") {
  //     rotateY(angle);
  //   }
  //   if (side === "f") {
  //     rotateZ(angle);
  //   }
  //   if (side === "b") {
  //     rotateZ(angle);
  //   }
  //   if (side === "l") {
  //     rotateX(angle);
  //   }
  //   if (side === "r") {
  //     rotateX(angle);
  //   }
  //   pop();
  // }

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
    this.currentTime = 0;
    this.startMillis = 0;
    this.currentMillis = 0;
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
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nx = cubeSize - 1 - somePiece.z;
        let nz = somePiece.x;
        somePiece.x = nx;
        somePiece.z = nz;
        somePiece.yRotation -= 90;
      }
      if (side === "d" && somePiece.y === 2) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nx = somePiece.z;
        let nz = cubeSize - 1 - somePiece.x;
        somePiece.x = nx;
        somePiece.z = nz;
        somePiece.yRotation += 90;
      }
      if (side === "f" && somePiece.z === 2) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nx = cubeSize - 1 - somePiece.y;
        let ny = somePiece.x;
        somePiece.x = nx;
        somePiece.y = ny;
        somePiece.zRotation += 90;
      }
      if (side === "b" && somePiece.z === 0) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nx = somePiece.y;
        let ny = cubeSize - 1 - somePiece.x;
        somePiece.x = nx;
        somePiece.y = ny;
        somePiece.zRotation -= 90;
      }
      if (side === "l" && somePiece.x === 0) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nz = somePiece.y;
        let ny = cubeSize - 1 - somePiece.z;
        somePiece.z = nz;
        somePiece.y = ny;
        somePiece.xRotation -= 90;
      }
      if (side === "r" && somePiece.x === 2) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nz = cubeSize - 1 - somePiece.y;
        let ny = somePiece.z;
        somePiece.z = nz;
        somePiece.y = ny;
        somePiece.xRotation += 90;
      }
    }
  }

  scramble() {
    let scrambleLength = random(6, 25);
    scramble = "";
    for (let i = 0; i < scrambleLength; i++) {
      let side = random(moves);
      this.turnSide(side);
      scramble = scramble + side + " ";
    }
    scramble = scramble.toUpperCase();
  }


  countdown() {
    resetMatrix();
    rotateY(180);

    if (keyIsDown(32) && !timerStarted) {
      timerReady = false;
      this.countdownTimer++;
      if (this.countdownTimer <= 25) {
        push();
        fill(255, 25, 0);
        translate(0, -400, 0);
        if (this.currentTime === 0) {
          text("0.00", 0, 0);
        }
        else {
          text(this.currentTime, 0, 0);
        }
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
    else {
      this.countdownTimer = 0;
      this.startTimer();
    }
  }

  startTimer() {
    resetMatrix();
    rotateY(180);
    timerStarted = !timerStarted;
    if (timerStarted && timerReady) {
      this.currentTime = ((millis() - this.startMillis) / 1000).toFixed(2);
    }
    push();
    fill(0);
    translate(0, -400, 0);
    if (this.currentTime === 0) {
      text("0.00", 0, 0);
    }
    else {
      text(this.currentTime, 0, 0);
    }
    pop();
  }
}

function keyPressed() {
  cube.turnSide(key);

  if (key === "s") {
    cube.scramble();
  }
  if (key === " ") {
    cube.startMillis = millis();
  }
  if (key === "e") {
    camera(500, -500, 500, 0, 0, 0, 0, 1, 0);
  }
}