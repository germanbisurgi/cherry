cherry.loop = function (config) {
  'use strict';
  config = config || {};
  this.delta = 0;
  this.lastTime = performance.now();
  this.fps = config.fps || 60;
  this.frame = 0;
  this.status = 'off';
  this.tasks = new cherry.pool({
    class: function (fn) {
      this.execute = fn;
    },
    reset: function (object, fn) {
      object.execute = fn;
    }
  });
  this.timestep = 1000 / this.fps;
};

cherry.loop.prototype.executeQueuedTasks = function () {
  var self = this;
  self.tasks.each(function (task) {
    task.execute();
    self.tasks.dismiss(task);
  });
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

cherry.loop.prototype.getTasks = function () {
  return this.tasks;
};

cherry.loop.prototype.getStatus = function () {
  return this.status;
};

cherry.loop.prototype.getTimestep = function () {
  return this.timestep;
};

cherry.loop.prototype.nextStep = function (task) {
  this.tasks.use(task);
};

cherry.loop.prototype.reset = function () {
  this.delta = 0;
  this.lastTime = performance.now();
  this.setFps(60);
  this.frame = 0;
  this.setStatus('off');
  this.getTasks().clear();
};

cherry.loop.prototype.setFps = function (fps) {
  this.fps = fps;
  this.timestep = 1000 / fps;
};

cherry.loop.prototype.setStatus = function (status) {
  this.status = status;
};

cherry.loop.prototype.start = function () {
  var self = this;
  this.setStatus('on');
  window.requestAnimationFrame(self.run.bind(this));
};

cherry.loop.prototype.run = function (timestamp) {
  var self = this;
  self.delta += timestamp - self.lastTime;
  self.lastTime = timestamp;
  while (self.delta >= self.timestep) {
    self.frame++;
    self.step();
    self.delta -= self.timestep;
  }
  if (self.getStatus() === 'on') {
    window.requestAnimationFrame(self.run.bind(this));
  }
};

cherry.loop.prototype.step = function () {
  var self = this;
  self.frame++;
  self.executeQueuedTasks();
  self.update(self.timestep);
};

cherry.loop.prototype.update = function () {};
