cherry.loop = function () {
  this.delta = 0;
  this.lastTime = performance.now();
  this.fps = 60;
  this.frame = 0;
  this.status = 'off';
  this.timestep = 1000 / this.fps;
  this.queuedTasks = new cherry.pool({
    class: function (fn) {
      this.execute = fn;
    },
    reset: function (object, fn) {
      object.execute = fn;
    }
  });
};

cherry.loop.prototype.executeQueuedTasks = function () {
  this.queuedTasks.each(function (task) {
    task.execute();
    this.queuedTasks.dismiss(task);
  }.bind(this));
};

cherry.loop.prototype.getDelta = function () {
  return this.delta;
};

cherry.loop.prototype.getFps = function () {
  return this.fps;
};

cherry.loop.prototype.getFrame = function () {
  return this.frame;
};

cherry.loop.prototype.getStatus = function () {
  return this.status;
};

cherry.loop.prototype.getTimestep = function () {
  return this.timestep;
};

cherry.loop.prototype.nextStep = function (task) {
  this.queuedTasks.use(task);
};

cherry.loop.prototype.setFps = function (fps) {
  this.fps = fps;
  this.timestep = 1000 / fps;
};

cherry.loop.prototype.setStatus = function (status) {
  this.status = status;
};

cherry.loop.prototype.start = function () {
  this.setStatus('on');
  window.requestAnimationFrame(this.run);
};

cherry.loop.prototype.run = function (timestamp) {
  this.delta += timestamp - this.lastTime;
  this.lastTime = timestamp;
  while (this.delta >= this.timestep) {
    this.frame++;
    this.step();
    this.delta -= this.timestep;
  }
  if (this.getStatus() === 'on') {
    window.requestAnimationFrame(this.run);
  }
};

cherry.loop.prototype.step = function () {
  this.frame++;
  this.executeQueuedTasks();
  this.update(this.timestep);
};

cherry.loop.prototype.update = function () {};