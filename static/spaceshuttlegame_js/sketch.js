// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// PolarToCartesian
// Convert a polar coordinate (r,theta) to cartesian (x,y):
// x = r * cos(theta)
// y = r * sin(theta)




function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize all values
  theta = 0;
  thrust= 0;
  mover = new Mover;
  ps = new ParticleSystem();

  alert("press arrow left or arrow right to steer, press z to boost");
}

function draw() {
  background(50);
  thrust = createVector(0,-0.5);

  push();
  stroke(random(255), random(255), random(255));
  strokeWeight(5);
  translate(width/2,height/2);
  thrust.rotate(theta);
  line(0,0, thrust.x*100, thrust.y*100);
  pop();
  mover.fill = 0;

  if (keyIsDown(90))
  {
    ps.addParticle(mover.position.x,mover.position.y, thrust.x*10, thrust.y*10);

    mover.applyForce(thrust);
    mover.fill = 255;
  }
  else if (keyIsDown(LEFT_ARROW)) {
    theta -= radians(5);
  }

  else if (keyIsDown(RIGHT_ARROW)) {
    theta += radians(5);
  }
  ps.run();
  mover.checkEdges();
  mover.update();
  mover.display();
}