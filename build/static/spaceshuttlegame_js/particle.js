// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Simple Particle System

class Particle {

  constructor(x, y,vx,vy) {
    this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(-vx, -vy);
    this.position = createVector(x, y);
    this.lifespan = 255.0;
    this.angle = 0;
    this.aVelocity = 0;
    this.aAcceleration = 0;
    this.choice = true;
  }

  run() {
    this.update();
    this.display();
  }

  // Method to update position
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.aAcceleration = mover.acceleration.x / 10.0;
    this.aVelocity += this.aAcceleration;
    this.aVelocity = constrain(this.aVelocity, -0.1, 0.1);
    this.angle += this.aVelocity;
    this.lifespan -= 2.0;
  }

  // Method to display
  display() {

    stroke(0, this.lifespan);
    strokeWeight(2);
    fill(random(255),random(255), random(255), this.lifespan);
    if (this.choice === true) {
      push();
      translate(this.position.x, this.position.y);
      rotate(this.angle);
      ellipse(0, 0, random(0,16), random(0,16));
      pop();
      this.choice= false;
    }
    else{
      push();
      translate(this.position.x, this.position.y);
      rotate(this.angle);
      rect(0, 0,random(0,16),random(0,16));
      pop();
      this.choice= true;
    }

  }

  // Is the particle still useful?
  isDead() {
    if (this.lifespan < 0.0) {
      return true;
    } else {
      return false;
    }
  }
}