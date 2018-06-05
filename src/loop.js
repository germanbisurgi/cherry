cherry.loop = function (config) {
  var self = this;
  config = config || {};
  self.delta = 0;
  self.lastTime = performance.now();
  self.fps = config.fps || 60;
  self.frame = 0;
  self.status = 'off';
  self.queuedTasks = new cherry.pool({
    class: function (fn) {
      this.execute = fn;
    },
    reset: function (object, fn) {
      object.execute = fn;
    }
  });
  self.timestep = 1000 / self.fps;

  self.executeQueuedTasks = function () {
    self.queuedTasks.each(function (task) {
      task.execute();
      self.queuedTasks.dismiss(task);
    });
  };

  self.getDelta = function () {
    return self.delta;
  };

  self.getFps = function () {
    return self.fps;
  };

  self.getFrame = function () {
    return self.frame;
  };

  self.getStatus = function () {
    return self.status;
  };

  self.getTimestep = function () {
    return self.timestep;
  };

  self.nextStep = function (task) {
    self.queuedTasks.use(task);
  };

  self.reset = function () {
    self.delta = 0;
    self.lastTime = performance.now();
    self.frame = 0;
    self.setFps(60);
    self.setStatus('off');
    self.queuedTasks.clear();
  };

  self.setFps = function (fps) {
    self.fps = fps;
    self.timestep = 1000 / fps;
  };

  self.setStatus = function (status) {
    self.status = status;
  };

  self.start = function () {
    self.setStatus('on');
    window.requestAnimationFrame(self.run);
  };

  self.run = function (timestamp) {
    self.delta += timestamp - self.lastTime;
    self.lastTime = timestamp;
    while (self.delta >= self.timestep) {
      self.frame++;
      self.step();
      self.delta -= self.timestep;
    }
    if (self.getStatus() === 'on') {
      window.requestAnimationFrame(self.run);
    }
  };

  self.step = function () {
    self.frame++;
    self.executeQueuedTasks();
    self.update(self.timestep);
  };

  self.update = function () {};
};

