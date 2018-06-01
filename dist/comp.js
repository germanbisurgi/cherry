var comp = {};

comp.objectPool = function (config) {
  'use strict';
  this.config = config || {};
  this.pool = [];
  this.used = 0;
};

comp.objectPool.prototype.clear = function () {
  this.pool = [];
  this.used = 0;
};

comp.objectPool.prototype.use = function () {

  // get a free object
  var unusedItem = false;
  this.pool.forEach(function (item) {
    if (item.active === false) {
      unusedItem = item;
    }
  });

  // if free object init and reuse it
  if (unusedItem) {
    this.config.reset.apply(this, [unusedItem.object].concat(Array.prototype.slice.call(arguments)));
    unusedItem.active = true;
    return unusedItem.object;
  }

  // if no free object creates one
  var item = {
    active: true,
    object: new (Function.prototype.bind.apply(this.config.class, [null].concat(Array.prototype.slice.call(arguments))))()
  };
  this.pool.push(item);
  this.used++;
  return item.object;
};

comp.objectPool.prototype.dismiss = function (obj) {
  // search o and deactivate it
  this.pool.forEach(function (item) {
    if (item.object === obj) {
      item.active = false;
    }
  });
  this.used--;
};

comp.objectPool.prototype.size = function () {
  return this.pool.length;
};

comp.objectPool.prototype.each = function (fn) {
  var length = this.pool.length;
  var i;
  for (i = 0; i < length; i++) {
    if (this.pool[i].active === true) {
      fn(this.pool[i].object, i);
    }
  }
};

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

if (typeof module !== 'undefined') {
  module.exports = comp;
}
