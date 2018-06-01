comp.gameLoop = function (config) {
  'use strict';
  config = config || {};
  this.delta = 0;
  this.fps = config.fps || 60;
  this.frame = 0;
  this.tasks = new comp.objectPool({
    class: function (delay, task) {
      this.delay = delay;
      this.task = task;
    },
    reset: function (object, delay, task) {
      this.delay = delay;
      this.task = task;
    }
  });
};

comp.gameLoop.prototype.tick = function () {
  this.frame++;
  var self = this;
  this.tasks.each(function (task) {
    if (task.delay === 0) {
      task.task();
      self.tasks.dismiss(task);
    } else {
      task.delay--;
    }
  });
};

comp.gameLoop.prototype.queueTask = function (delay, task) {
  this.tasks.use(delay, task);
};
