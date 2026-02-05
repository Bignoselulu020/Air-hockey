// Anna Wasson
// Lab 4: Pong
// 2-10-19

// Random Ball Placement
var xBall = Math.floor(Math.random() * 300) + 50;
var yBall = 50;
var xSpeed = (2, 7);
var ySpeed = (-7, -2);
var score = 0;

let paddleSpeed = 10;
//global variables
let askButton;

// device motion
let accX = 0;
let accY = 0;
let accZ = 0;
let rrateX = 0;
let rrateY = 0;
let rrateZ = 0;

// device orientation
let rotateDegrees = 0;
let frontToBack = 0;
let leftToRight = 0;

let x = 0;
let y = 300;

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
  angleMode(DEGREES);

  //----------
  //the bit between the two comment lines could be move to a three.js sketch except you'd need to create a button there
  if (
    typeof DeviceMotionEvent.requestPermission === "function" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    // iOS 13+
    askButton = createButton("Permission"); //p5 create button
    askButton.mousePressed(handlePermissionButtonPressed); //p5 listen to mousePressed event
  } else {
    //if there is a device that doesn't require permission
    window.addEventListener("devicemotion", deviceMotionHandler, true);
    window.addEventListener("deviceorientation", deviceTurnedHandler, true);
  }

  //----------
}

//we are using p5.js to visualise this movement data
function draw() {
  // Background
  background(0);

  let totalMovement = Math.abs(accX) + Math.abs(accY) + Math.abs(accZ); //movement in any direction
  //set your own threshold for how sensitive you want this to be
  if (totalMovement > 2) {
    //background(0, 255, 0);
  } else {
    // background(255);
  }
  //Creating a tilt sensor mechanic that has a sort of boolean logic (on or off)
  //if the phone is rotated front/back/left/right we will get an arrow point in that direction
  push();
  translate(width / 2, height / 2);

  if (frontToBack > 40) {
    push();
    rotate(-180);
    //triangle(-30, -40, 0, -100, 30, -40);
    pop();
  } else if (frontToBack < 0) {
    push();
    //triangle(-30, -40, 0, -100, 30, -40);
    pop();
  }

  if (leftToRight > 20) {
    //right is red
    fill(255, 0, 0);
    push();
    rotate(90);
    triangle(-30, -40, 0, -100, 30, -40);
    pop();

    // update variable for moving sideway
    x += paddleSpeed;
  } else if (leftToRight < -20) {
    //left is blue
    fill(0, 0, 255);
    push();
    rotate(-90);
    triangle(-30, -40, 0, -100, 30, -40);
    pop();
    x += -paddleSpeed;
  }

  pop();

  fill(255, 0, 0);
  //rect(x, y, 50, 20);

  //Debug text
  fill(0);
  textSize(15);

  text("acceleration: ", 10, 10);
  text(
    accX.toFixed(2) + ", " + accY.toFixed(2) + ", " + accZ.toFixed(2),
    10,
    40
  );

  text("rotation rate: ", 10, 80);
  text(
    rrateX.toFixed(2) + ", " + rrateY.toFixed(2) + ", " + rrateZ.toFixed(2),
    10,
    110
  );

  text("device orientation: ", 10, 150);
  text(
    rotateDegrees.toFixed(2) +
      ", " +
      leftToRight.toFixed(2) +
      ", " +
      frontToBack.toFixed(2),
    10,
    180
  );
  // Paddle
  fill("#ffffff");
  constrain(x, -200, 200);
  if (x<0)
  {x=0;}
if(x>windowWidth){
x=windowWidth}
  rect(x, 375, 90, 15);

  //Functions
  move();
  display();
  bounce();
  //resetBall();
  paddle();

  //Score
  fill("#d9c3f7");
  textSize(24);
  text("Score: " + score, 10, 25);
}

// Ball Functions
function move() {
  xBall += xSpeed;
  yBall += ySpeed;
}

function bounce() {
  if (xBall < 10 || xBall > 400 - 10) {
    xSpeed *= -1;
  }
  if (yBall < 10 || yBall > 400 - 10) {
    ySpeed *= -1;
  }
}

// Reset Ball
//function resetBall() {
//  if (yBall >= 400 ||
//    yBall > 400 - 10) {
//    ySpeed = 4;
// }

//}

function display() {
  fill("#d9c3f7");
  ellipse(xBall, yBall, 20, 20);
}

// Bounce off Paddle
function paddle() {
  if (xBall > x && xBall < x + 90 && yBall + 10 >= 375) {
    xSpeed *= -1;
    ySpeed *= -1;
    score++;
  }
}

//Everything below here you could move to a three.js or other javascript sketch

function handlePermissionButtonPressed() {
  DeviceMotionEvent.requestPermission().then((response) => {
    // alert(response);//quick way to debug response result on mobile, you get a mini pop-up
    if (response === "granted") {
      window.addEventListener("devicemotion", deviceMotionHandler, true);
    }
  });

  DeviceOrientationEvent.requestPermission()
    .then((response) => {
      if (response === "granted") {
        // alert(response);//quick way to debug response result on mobile, you get a mini pop-up
        window.addEventListener("deviceorientation", deviceTurnedHandler, true);
      }
    })
    .catch(console.error);
}

//AVERAGE YOUR DATA!!!
//Microphone input from last term....

// https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event
function deviceMotionHandler(event) {
  accX = event.acceleration.x;
  accY = event.acceleration.y;
  accZ = event.acceleration.z;

  rrateZ = event.rotationRate.alpha; //alpha: rotation around z-axis
  rrateX = event.rotationRate.beta; //rotating about its X axis; that is, front to back
  rrateY = event.rotationRate.gamma; //rotating about its Y axis: left to right
}

//https://developer.mozilla.org/en-US/docs/Web/API/Window/deviceorientation_event
function deviceTurnedHandler(event) {
  //degrees 0 - 365
  rotateDegrees = event.alpha; // alpha: rotation around z-axis
  frontToBack = event.beta; // beta: front back motion
  leftToRight = event.gamma; // gamma: left to right
}
