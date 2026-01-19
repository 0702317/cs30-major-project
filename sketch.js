// Rubik's Cube Simlator/Solve Timer
// Graham Lindsay
// January 19th, 2025

// Sources
// - 
// - 
// - 

let cube;
let cubeArray = [];
let piece;
let cubeSize = 3;
let pieceSize = 300 / cubeSize;
let moves = ["u", "d", "f", "b", "l", "r", "U", "D", "F", "B", "L", "R"];
let scramble = "Press S to scramble.";
let font;
let cam;
let turnSound;
let music;
let timerStarted = false;
let timerReady = false;
let instructionsHidden = true;

// preload assets.
function preload() {
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
  camera(400, -400, 400, 0, 0, 0, 0, 1, 0);

  turnSound.setVolume(0.25);

  document.getElementById("instructions").hidden = true;

  cube = new Cube();
  cube.generate();
}

// draw loop.
function draw() {
  background(160);
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
    if (cubeSize === 3) {
      translate(-pieceSize, -pieceSize, -pieceSize);
    }
    if (cubeSize === 2) {
      translate(-pieceSize/2, -pieceSize/2, -pieceSize/2);
    }

    for (let rotation of this.rotations) {
      if (rotation === "u") {
        rotateY(-90);
      }
      if (rotation === "U") {
        rotateY(90);
      }
      if (rotation === "d") {
        rotateY(90);
      }
      if (rotation === "D") {
        rotateY(-90);
      }
      if (rotation === "f") {
        rotateZ(90);
      }
      if (rotation === "F") {
        rotateZ(-90);
      }
      if (rotation === "b") {
        rotateZ(-90);
      }
      if (rotation === "B") {
        rotateZ(90);
      }
      if (rotation === "l") {
        rotateX(-90);
      }
      if (rotation === "L") {
        rotateX(90);
      }
      if (rotation === "r") {
        rotateX(90);
      }
      if (rotation === "R") {
        rotateX(-90);
      }
    }

    // create the 3D piece.
    this.createPiece();
  }

  // create the design for a single piece.
  createPiece() {
    // the design is just 6 different colour cubes put together to create one cube with 6 different coloured faces.
    // not the most efficient way to do colours because it is rendering colours that cant be seen, but it saves lots of difficult calculations for orientation of pieces and distinguising between corner/edge pieces.
    push();
    translate(0, -3, 0);
    fill("#ffffff");
    box(pieceSize);
    pop();
    push();
    translate(0, 3, 0);
    fill("#f6ff00");
    box(pieceSize);
    pop();
    push();
    translate(3, 0, 0);
    fill("#B90000");
    box(pieceSize);
    pop();
    push();
    translate(-3, 0, 0);
    fill("#ff8b1a");
    box(pieceSize);
    pop();
    push();
    translate(0, 0, 3);
    fill("#009B48");
    box(pieceSize);
    pop();
    push();
    translate(0, 0, -3);
    fill("#00398f");
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
    this.seconds = 0;
    this.minutes = 0;
    this.milliseconds = 0;
    this.heldTime = 0;
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
    document.getElementById("scramble").innerHTML = scramble;
    if (this.currentTime === 0) {
      document.getElementById("timer").innerHTML = "0:00.00";
    }
    else {
      this.seconds = Math.floor(this.currentTime / 1000) % 60;
      this.minutes = Math.floor(this.currentTime / 60000);
      this.milliseconds = Math.floor(this.currentTime) - this.seconds * 1000 - this.minutes * 60000;
      if (this.seconds < 10) {
        document.getElementById("timer").innerHTML = this.minutes + ":0" + this.seconds + "." + this.milliseconds;
      }
      else {
        document.getElementById("timer").innerHTML = this.minutes + ":" + this.seconds + "." + this.milliseconds;
      }
    }
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
      if (side === "U" && somePiece.y === 0) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nx = somePiece.z;
        let nz = cubeSize - 1 - somePiece.x;
        somePiece.x = nx;
        somePiece.z = nz;
        somePiece.rotations.unshift(side);
      }
      if (side === "d" && somePiece.y === cubeSize - 1) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nx = somePiece.z;
        let nz = cubeSize - 1 - somePiece.x;
        somePiece.x = nx;
        somePiece.z = nz;
        somePiece.rotations.unshift(side);
      }
      if (side === "D" && somePiece.y === cubeSize - 1) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nx = cubeSize - 1 - somePiece.z;
        let nz = somePiece.x;
        somePiece.x = nx;
        somePiece.z = nz;
        somePiece.rotations.unshift(side);
      }
      if (side === "f" && somePiece.z === cubeSize - 1) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nx = cubeSize - 1 - somePiece.y;
        let ny = somePiece.x;
        somePiece.x = nx;
        somePiece.y = ny;
        somePiece.rotations.unshift(side);
      }
      if (side === "F" && somePiece.z === cubeSize - 1) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nx = somePiece.y;
        let ny = cubeSize - 1 - somePiece.x;
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
      if (side === "B" && somePiece.z === 0) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nx = cubeSize - 1 - somePiece.y;
        let ny = somePiece.x;
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
      if (side === "L" && somePiece.x === 0) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nz = somePiece.y;
        let ny = cubeSize - 1 - somePiece.z;
        somePiece.z = nz;
        somePiece.y = ny;
        somePiece.rotations.unshift(side);
      }
      if (side === "r" && somePiece.x === cubeSize - 1) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nz = somePiece.y;
        let ny = cubeSize - 1 - somePiece.z;
        somePiece.z = nz;
        somePiece.y = ny;
        somePiece.rotations.unshift(side);
      }
      if (side === "R" && somePiece.x === cubeSize - 1) {
        if (!turnSound.isPlaying()) {
          turnSound.play();
        }
        let nz = cubeSize - 1 - somePiece.y;
        let ny = somePiece.z;
        somePiece.z = nz;
        somePiece.y = ny;
        somePiece.rotations.unshift(side);
      }
    }
  }

  // generate and apply a scramble.
  scramble() {
    let scrambleLength = random(12, 28); // choose a random length.
    scramble = "";
    for (let i = 0; i < scrambleLength; i++) { // create a random sequence of moves, and then update the cube.
      let side = random(moves);
      this.turnSide(side);
      if (side === side.toUpperCase()) {
        side = side + "'";
      }
      scramble = scramble + side + " ";
    }
    scramble = scramble.toUpperCase(); // set the letters to uppercase for the scramble display.
  }

  // first timer to detect if you are holding space for long enough.
  countdown() {
    resetMatrix();
    rotateY(180);
    // this.heldTime = 0;
    if (keyIsDown(32) && !timerStarted) {
      timerReady = false;
      this.countdownTimer++;
      this.heldTime = millis();
      if (this.countdownTimer <= 35) { // fill red if space is pressed but not held for long enough.
        document.getElementById("timer").style.color = "#ff1900";
      }
      else { // fill green when the timer is ready to be started.
        document.getElementById("timer").style.color = "#04DD04";
        document.getElementById("timer").innerHTML = "0:00.00";
        timerReady = true; // set the timerReady variable to true.
      }
    }
    else { // if space is not down, set the countdown to 0 and try to start the timer.
      this.countdownTimer = 0;
      this.startTimer();
    }
  }

  // start the timer.
  // main code for the timer inspired by https://editor.p5js.org/hanxyn888@gmail.com/sketches/ir8PEq3L2
  startTimer() {
    resetMatrix();
    rotateY(180);
    timerStarted = !timerStarted; // switch the state of the timerStarted variable.
    if (timerStarted && timerReady) { // if timerStarted and timerReady are true, update the currentTime.
      this.currentTime = ((millis() - this.startMillis)) - 600;
    }
    document.getElementById("timer").style.color = "black";
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
    camera(400, -400, 400, 0, 0, 0, 0, 1, 0);
  }
  if (key === "i") {
    instructionsHidden = !instructionsHidden;
    if (instructionsHidden) {
      document.getElementById("instructions").hidden = true;
    }
    else {
      document.getElementById("instructions").hidden = false;
    }
  }
}