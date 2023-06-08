//Variables for background image files and their animated x values//
let clouds1;
let clouds2;
let cloudsX = 0;
let cloudsXX = -2000;

//Audio variables for mic input//
let mic;
let vol;
let osc;

//Variable for storing mp3 file//
let soundtrack;

// Orb modules//
let orb1;
let orbSpeed = 5;
let orbEase = 0.03;


//Particle modules//
let pMove = [];
let pNum;
let r = 75;
let pColour;

//Preloads the media files that are used in the project//
function preload() {
  soundtrack = loadSound("soundtrack.mp3");
  clouds1 = loadImage("clouds1.png");
  clouds2 = loadImage("clouds2.png");
}


//Setup//
function setup() {
  let canvas = createCanvas(1000, 700);

  //Positions the sketch canvas within the specified div element on the page.
  canvas.parent('sketch-holder');

  //Set number of particle elements//
  pNum = 50;

  //Initialise audio input from microphone//
  mic = new p5.AudioIn();
  mic.start();

  //Global colour attribute for background particles
  pColour = color(218, 108, 232);

  //Creates main orb object//
  orb1 = new orb(5);

  //Loop that populates particle movement array//
  for (let i = 0; i < pNum; i++) {
    pMove.push(new Move(0.005, 0.005))
  }

  //Play and loop mp3 file//
  soundtrack.play();
  soundtrack.loop();

}


//Draw//
function draw() {
  background(0);

  //Stores incoming audio from microphone in "vol" variable//
  vol = mic.getLevel();

  //Background cloud layer image//
  image(clouds1, cloudsX, 0);
  cloudsX -= 0.2; //Moves the image on the x axis by stated increments each draw//

  //Calls the particle system function to the sketch//
  displayParticles();




  //Draw main orb//
  orb1.move();
  if (vol > 0.3) {     //If statement that switches
    orb1.displayLoud(); //to red orb when incoming audio
  }                     //is above a certain level.
  else {
    orb1.displayNormal();
  }

  //Foreground cloud image layer//
  image(clouds2, cloudsXX, 0);
  cloudsXX += 0.2;

  //Resets cloud layers when they reach end of image//
  if (cloudsX < -2000) {
    cloudsX = 0;
  }

  if (cloudsXX > 0) {
    cloudsXX = -2000;
  }


  // console.log(vol); //Monitors the incoming audio level.

}


//Classes//

// Main Orb Class//
class orb {
  constructor(diameter) {
    this.x = width / 2;
    this.y = height - 100;
    this.easeX = width / 2;
    this.easeY = height - 100;
    this.diameter = diameter;
  }

  displayNormal() { //Controls the appearance of the orb

    //A semi opaque glow around the orb.
    push();
    stroke(155, 150, 255, 70);
    strokeWeight(10);
    fill(155, 213, 255);
    ellipse(this.x, this.y, 105, 105);
    pop();

    //Loop that creates 20 circles, each smaller than the last and of varying
    //shades of blue, creating the illusion of one shape with a gradient.
    //The vol variable is used to scale each circle according to incoming sound levels.
    for (var i = 20; i > 0; i--) {
      push();
      noStroke();
      fill(155 / i, 219 / i, 255 - (i * 10), 50);
      ellipse(this.x, this.y, i * this.diameter + vol * 300, i * this.diameter + vol * 300);
      pop();
    }
  }

  displayLoud() {

    //A semi opaque glow around the orb.
    push();
    stroke(255, 100, 50, 70);
    strokeWeight(10);
    fill(255, 50, 155);
    ellipse(this.x, this.y, 105, 105);
    pop();

    //Loop that creates 20 circles, each smaller than the last and of varying
    //shades of blue, creating the illusion of one shape with a gradient.
    //The vol variable is used to scale each circle according to incoming sound levels.
    for (var i = 20; i > 0; i--) {
      push();
      noStroke();
      fill(255 / i, 100 / i, 50 - (i * 10), 50);
      ellipse(this.x, this.y, i * this.diameter + vol * 100, i * this.diameter + vol * 100);
      pop();
    }

  }

  move() { //Controls the movement of the main orb

    //null x and y values move according to arrow key presses
    //while the x and y values for the orb follow the null values
    //with a lag percentage as stated by the orbEase variable. 
    this.x += (this.easeX - this.x) * orbEase;
    this.y += (this.easeY - this.y) * orbEase;

    if (keyIsPressed) {
      if (keyCode == LEFT_ARROW) {
        this.easeX -= orbSpeed;
      }
      else if (keyCode == RIGHT_ARROW) {
        this.easeX += orbSpeed;
      }
      else if (keyCode == UP_ARROW) {
        this.easeY -= orbSpeed;
      }
      else if (keyCode == DOWN_ARROW) {
        this.easeY += orbSpeed;
      }
    }

    //Moves the guiding x and y values further into the
    //canvas when the orb hits the edge so as to make
    //it appear that the orb rebounds off the walls
    if (this.x < this.diameter * 20 / 2) {
      this.easeX = (this.diameter * 20 / 2) + 70;
    }
    else if (this.x > width - (this.diameter * 20 / 2)) {
      this.easeX = width - (this.diameter * 20 / 2) - 70;
    }
    else if (this.y < this.diameter * 20 / 2) {
      this.easeY = (this.diameter * 20 / 2) + 70;
    }
    else if (this.y > height - (this.diameter * 20 / 2)) {
      this.easeY = height - (this.diameter * 20 / 2) - 70;
    }
  }

}

//Background Particle Movement Rules//

class Move {
  constructor(pRate, pSpeed) {
    this.x = random(width);
    this.y = random(height);
    this.targetX = random(width);
    this.targetY = random(height);
    this.rate = pRate;
    this.speed = pSpeed;
  }

  update() {
    if (random(1) < this.rate) {
      this.targetX = random(width);
      this.targetY = random(height);
    }
    this.x = lerp(this.x, this.targetX, this.speed);
    this.y = lerp(this.y, this.targetY, this.speed);
  }

}

function displayParticles() {
  //Loop that updates the x and y corordinates of particle system
  //elements on every draw.
  for (let i = 0; i < pMove.length; i++) {
    pMove[i].update();
    let pX = pMove[i].x;
    let pY = pMove[i].y;

    //Nested loop that calculates distance between different
    //point elements, and draws a line between them if they are less
    //than 75px apart, as specified by the "r" variable.
    for (let j = 0; j < pMove.length; j++) {
      let pXX = pMove[j].x;
      let pYY = pMove[j].y;
      let d = dist(pX, pY, pXX, pYY);

      if (d < r && i !== j) {
        let membraneWidth = map(d, 0, r, 5, 1);
        let membraneOpacity = map(membraneWidth, 5, 1, 255, 50);


        strokeWeight(membraneWidth);        //Connecting line
        stroke(pColour, membraneOpacity);   //appearance
        strokeCap(ROUND);
        line(pX, pY, pXX, pYY);
      }
    }
    strokeWeight(7); //Particle element appearance
    stroke(pColour); //settings
    point(pX, pY);
    strokeWeight(4);
    stroke(0, 255, 179);
    point(pX, pY);

  }
}

//Any key press will alert the browser of a user gesture and the audio
//elements of the programme will activate
function keyPressed() {
  userStartAudio();
}