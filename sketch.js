// Rubik's Cube Simlator/Solve Timer
// Graham Lindsay
// January 19th, 2025

let cube;
let cubeArray = [];
let piece;
let cubeSize = 3;
let pieceSize = 300/cubeSize;
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
  cube.generate();
  // cube.scramble()
}

function draw() {
  background(100);
  orbitControl();
  cube.display();
  cube.countdown();
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
    this.countdownTimer = 0;
    this.milliseconds = 0;
    this.seconds = 0;
    this.minutes = 0;
  }

  generate() {
    for (let z = 0; z < this.cubeSize; z++) {
      cubeArray.push([]);
      for (let y = 0; y < this.cubeSize; y++) {
        cubeArray[z].push([]);
        for (let x = 0; x < this.cubeSize; x++) {
          let xMatrix = new Matrix([this.cubeSize, this.cubeSize]);
          let yMatrix = new Matrix([this.cubeSize, this.cubeSize]);
          let zMatrix = new Matrix([this.cubeSize, this.cubeSize]);
          // xMatrix.setNum(0, x);
          // cubeArray[z][y].push(new Piece(cubeMatrix, y * pieceSize, z * pieceSize, 0, 0, 0));
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

  turnSide(side) {
    for (let z = 0; z < cubeSize; z++) {
      for (let y = 0; y < cubeSize; y++) {
        for (let x = 0; x < cubeSize; x++) {
          let somePiece = cubeArray[z][y][x];
          if (side === "u") {
            if (somePiece.y === 0) {
              somePiece.yRotation -= 90;
            }
          }
          if (side === "d") {
            if (somePiece.y === 200) {
              somePiece.yRotation += 90;
            }
          }
          else if (side === "f") {
            if (somePiece.z === 200) {
              somePiece.zRotation += 90;
            }
          }
          else if (side === "b") {
            if (somePiece.z === 0) {
              somePiece.zRotation -= 90;
            }
          }
          else if (side === "l") {
            if (somePiece.x === 0) {
              somePiece.xRotation -= 90;
            }
          }
          else if (side === "r") {
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
    else  {
      this.countdownTimer = 0;
      this.startTimer();
    }
  }

  startTimer() {  
    resetMatrix();
    rotateY(180);
    
    if (timerReady) {
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
  }
}

function keyPressed() {
  cube.turnSide(key);

  if (key === "s") {
    cube.scramble();
  }
}