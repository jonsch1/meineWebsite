// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

class Mover {

  constructor(x, y) {
    this.position = createVector(width/2, height/2);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.fill = 0;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.velocity.x = constrain(this.velocity.x,-25, 25);
    this.velocity.y = constrain(this.velocity.y,-25,25);
  }

  display() {
    stroke(0);
    fill(175, 200);
    rectMode(CENTER);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    triangle(-9.5, -9.5, 9.5, -9.5, 0, -30);
    fill(this.fill);
    rect(0, 0 , 19, 19);
    pop();
  }

  checkEdges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    }
    else if (this.position.y < 0) {
      this.position.y = height;
    }
  }
}