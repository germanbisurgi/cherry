cherry.Loop = function () {
  this.accumulator  = 0;
  this.delta = 0;
  this.lastTime = 0;
  this.lastStep = 0;
  this.fps = 60;
  this.frame = 0;
  this.status = 'off';
  this.timestep = 1000 / this.fps;

  var queuedTask = function (fn) {
    this.execute = fn;
  };

  this.queuedTasks = new cherry.Pool(queuedTask, function (object, fn) {
    object.execute = fn;
  });

};

cherry.Loop.prototype.executeQueuedTasks = function () {
  this.queuedTasks.each(function (task) {
    task.execute();
    this.queuedTasks.dismiss(task);
  }.bind(this));
};

cherry.Loop.prototype.nextStep = function (task) {
  this.queuedTasks.use(task);
};

cherry.Loop.prototype.start = function () {
  this.status = 'on';
  window.requestAnimationFrame(this.run.bind(this));
};

cherry.Loop.prototype.run = function (timestamp) {
  this.timestep = 1000 / this.fps;
  this.accumulator += timestamp - this.lastTime;
  this.lastTime = timestamp;
  while (this.accumulator >= this.timestep) {
    this.frame++;
    this.step();
    this.delta = timestamp - this.lastStep;
    this.lastStep = timestamp;
    this.accumulator -= this.timestep;
  }
  if (this.status === 'on') {
    window.requestAnimationFrame(this.run.bind(this));
  };
};

cherry.Loop.prototype.step = function () {
  this.frame++;
  this.executeQueuedTasks();
  this.onStep();
};

cherry.Loop.prototype.onStep = function () {};
