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

// preload assets.
function preload() {
  font = loadFont("assets/ARIALBD.TTF");
  turnSound = loadSound("assets/rubiks_cube_turn.mp3");
}

// setup function.
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  strokeWeight(8);
  // debugMode();
  angleMode(DEGREES);

  // back face culling.
  drawingContext.enable(drawingContext.CULL_FACE);
  drawingContext.cullFace(drawingContext.FRONT);

  // position and orient the camera.
  camera(500, -500, 500, 0, 0, 0, 0, 1, 0);

  // set up text properties.
  textFont(font);
  textSize(100);
  textAlign(CENTER, CENTER);

  turnSound.setVolume(0.25);

  cube = new Cube();
  cube.generate();
  // cube.scramble()
}

// draw loop.
function draw() {
  background(211);
  orbitControl();
  cube.display(); // display cube.
  cube.countdown(); // timer countdown.
}

// piece object.
class Piece {
  constructor(x, y, z, xRotation, yRotation, zRotation) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.xRotation = xRotation;
    this.yRotation = yRotation;
    this.zRotation = zRotation;
    this.rotations = [];
  }

  display() { // display the piece and perform rotations & translations.
    resetMatrix();

    // move pieces into place.
    translate(this.x * pieceSize, this.y * pieceSize, this.z * pieceSize);
    translate(-100, -100, -100);

    for (let rotation of this.rotations) {
      if (rotation === "u") {
        rotateY(-90);
      }
      if (rotation === "d") {
        rotateY(90);
      }
      if (rotation === "f") {
        rotateZ(90);
      }
      if (rotation === "b") {
        rotateZ(-90);
      }
      if (rotation === "l") {
        rotateX(-90);
      }
      if (rotation === "r") {
        rotateX(90);
      }
    }
    
    // rotate the pieces.
    // rotateX(this.xRotation);
    // rotateY(this.yRotation);
    // rotateZ(this.zRotation);

    // create the 3D piece.
    this.createPiece();
  }

  // create the design for a single piece.
  createPiece() {
    // the design is just 6 different colour cubes put together to create one cube with 6 different coloured faces.
    // not the most efficient way to do colours because it is rendering colours that cant be seen, but it saves lots of difficult calculations for orientation of pieces and distinguising between corner/edge pieces.
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

// cube object.
class Cube {
  constructor() {
    // variables for timer.
    this.countdownTimer = 0;
    this.currentTime = 0;
    this.startMillis = 0;
    this.currentMillis = 0;
    let minutes = 0;
  }

  // generate an array filled with the pieces of the cube.
  generate() {
    for (let z = 0; z < cubeSize; z++) {
      for (let y = 0; y < cubeSize; y++) {
        for (let x = 0; x < cubeSize; x++) {
          cubeArray.push(new Piece(x, y, z, 0, 0, 0));
        }
      }
    }
  }

  // display each piece and the scramble.
  display() {
    for (let somePiece of cubeArray) {
      somePiece.display();
    }

    // display scamble.
    push();
    resetMatrix();
    translate(0, 500, 0);
    fill(0);
    rotateY(180);
    text(scramble, 0, 0);
    pop();
  }

  // turn a side of the cube.
  turnSide(side) {
    for (let somePiece of cubeArray) {
      if (side === "u" && somePiece.y === 0) { // if the "u" key is pressed, rotate and update the positions of each piece with a y positin of 0.
        if (!turnSound.isPlaying()) { // play a turn sound effect.
          turnSound.play();
        }
        let nx = cubeSize - 1 - somePiece.z; // create the new x position.
        let nz = somePiece.x; // create the new z position.
        somePiece.x = nx; // update x position.
        somePiece.z = nz; // update z position.
        somePiece.rotations.unshift(side);
      }

      // repeat for the rest of the moves.
      if (side === "d" && somePiece.y === 2) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nx = somePiece.z;
        let nz = cubeSize - 1 - somePiece.x;
        somePiece.x = nx;
        somePiece.z = nz;
        somePiece.rotations.unshift(side);
      }
      if (side === "f" && somePiece.z === 2) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nx = cubeSize - 1 - somePiece.y;
        let ny = somePiece.x;
        somePiece.x = nx;
        somePiece.y = ny;
        somePiece.rotations.unshift(side);
      }
      if (side === "b" && somePiece.z === 0) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nx = somePiece.y;
        let ny = cubeSize - 1 - somePiece.x;
        somePiece.x = nx;
        somePiece.y = ny;
        somePiece.rotations.unshift(side);
      }
      if (side === "l" && somePiece.x === 0) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nz = cubeSize - 1 - somePiece.y;
        let ny = somePiece.z;
        somePiece.z = nz;
        somePiece.y = ny;
        somePiece.rotations.unshift(side);
      }
      if (side === "r" && somePiece.x === 2) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nz = somePiece.y;
        let ny = cubeSize - 1 - somePiece.z;
        somePiece.z = nz;
        somePiece.y = ny;
        somePiece.rotations.unshift(side);
      }
    }
  }

  // generate and apply a scramble.
  scramble() {
    let scrambleLength = random(10, 25); // choose a random length.
    scramble = "";
    for (let i = 0; i < scrambleLength; i++) { // create a random sequence of moves, and then update the cube.
      let side = random(moves);
      this.turnSide(side);
      scramble = scramble + side + " ";
    }
    scramble = scramble.toUpperCase(); // set the letters to uppercase for the scramble display.
  }

  // first timer to detect if you are holding space for long enough.
  countdown() {
    resetMatrix();
    rotateY(180);

    if (keyIsDown(32) && !timerStarted) {
      timerReady = false;
      this.countdownTimer++;
      if (this.countdownTimer <= 35) { // fill red if space is pressed but not held for long enough.
        push();
        fill(255, 25, 0);
        translate(0, -400, 0);
        if (this.currentTime === 0) { // formatting so that the timer displays decimal places even when at 0.
          text("0.00", 0, 0);
        }
        else {
          text(this.currentTime, 0, 0);
        }
        pop();
      }
      else { // fill green when the timer is ready to be started.
        push();
        fill(56, 235, 0);
        translate(0, -400, 0);
        text("0.00", 0, 0);
        pop();
        timerReady = true; // set the timerReady variable to true.
      }
    }
    else { // if space is not down, set the countdown to 0 and try to start the timer.
      this.countdownTimer = 0;
      this.startTimer();
    }
  }

  // start the timer.
  startTimer() {
    resetMatrix();
    rotateY(180);
    timerStarted = !timerStarted; // switch the state of the timerStarted variable.
    if (timerStarted && timerReady) { // if timerStarted and timerReady are true, update the currentTime.
      this.currentTime = ((millis() - this.startMillis) / 1000).toFixed(2);
    }
    push();
    fill(0);
    translate(0, -400, 0);
    if (this.currentTime === 0) { // display the timer on screen.
      text("0.00", 0, 0);
    }
    else {
      text(this.currentTime, 0, 0);
    }
    pop();
  }
}

// key pressed function.
function keyPressed() {
  cube.turnSide(key); // turn the side of the cube for whatever key you press.

  if (key === "s") { // scramble the cube if "s" is pressed.
    cube.scramble();
  }
  if (key === " ") { // start timer when space is pressed.
    cube.startMillis = millis();
  }
  if (key === "e") { // reset camera position when "e" is pressed.
    camera(500, -500, 500, 0, 0, 0, 0, 1, 0);
  }
}