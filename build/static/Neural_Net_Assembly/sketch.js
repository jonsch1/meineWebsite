// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let ps;
let neurons;

function setup() {
  createCanvas(windowWidth, windowHeight-76);
  ps = new ParticleSystem(createVector(width / 2, 50));
  neurons = new NeuronSystem(20);


}

function draw() {
  background(51);

  neurons.neuronAxonInteraction();
  neurons.run();
  ps.run();

}