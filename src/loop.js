var Loop = function () {
  this.accumulator = 0;
  this.delta = 0;
  this.lastTime = 0;
  this.lastStep = 0;
  this.fps = 60;
  this.frame = 0;
  this.paused = true;
  this.timestep = 1000 / this.fps;
};

Loop.prototype.start = function () {
  this.paused = false;
  window.requestAnimationFrame(this.run.bind(this));
};

Loop.prototype.stop = function () {
  this.paused = true;
};

Loop.prototype.run = function (timestamp) {
  this.timestep = 1000 / this.fps;
  this.accumulator += timestamp - this.lastTime;
  this.lastTime = timestamp;
  while (this.accumulator >= this.timestep) {
    this.step();
    this.delta = timestamp - this.lastStep;
    this.lastStep = timestamp;
    this.accumulator -= this.timestep;
  }
  if (!this.paused) {
    window.requestAnimationFrame(this.run.bind(this));
  }
};

Loop.prototype.step = function () {
  this.frame++;
  this.onStep();
};

Loop.prototype.onStep = function () {};
