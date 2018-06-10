cherry.Loop = function () {
  this.accumulator  = 0;
  this.delta = 0;
  this.lastTime = 0;
  this.lastStep = 0;
  this.fps = 60;
  this.frame = 0;
  this.status = 'off';
  this.timestep = 1000 / this.fps;
  this.queuedTasks = new cherry.Pool({
    class: function (fn) {
      this.execute = fn;
    },
    reset: function (object, fn) {
      object.execute = fn;
    }
  });
};

cherry.Loop.prototype.executeQueuedTasks = function () {
  this.queuedTasks.each(function (task) {
    task.execute();
    this.queuedTasks.dismiss(task);
  }.bind(this));
};

cherry.Loop.prototype.getDelta = function () {
  return this.delta;
};

cherry.Loop.prototype.getFps = function () {
  return this.fps;
};

cherry.Loop.prototype.getFrame = function () {
  return this.frame;
};

cherry.Loop.prototype.getStatus = function () {
  return this.status;
};

cherry.Loop.prototype.getTimestep = function () {
  return this.timestep;
};

cherry.Loop.prototype.nextStep = function (task) {
  this.queuedTasks.use(task);
};

cherry.Loop.prototype.setFps = function (fps) {
  this.fps = fps;
  this.timestep = 1000 / fps;
};

cherry.Loop.prototype.setStatus = function (status) {
  this.status = status;
};

cherry.Loop.prototype.start = function () {
  this.setStatus('on');
  window.requestAnimationFrame(this.run.bind(this));
};

cherry.Loop.prototype.run = function (timestamp) {
  this.accumulator += timestamp - this.lastTime;
  this.lastTime = timestamp;
  while (this.accumulator >= this.timestep) {
    this.frame++;
    this.step();
    this.delta = timestamp - this.lastStep;
    this.lastStep = timestamp;
    this.accumulator -= this.timestep;
  }
  if (this.getStatus() === 'on') {
    window.requestAnimationFrame(this.run.bind(this));
  };
};

cherry.Loop.prototype.step = function () {
  this.frame++;
  this.executeQueuedTasks();
  this.update(this.timestep);
};

cherry.Loop.prototype.update = function () {};
