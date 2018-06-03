var cherry = {};

window.requestAnimFrame = function () {
  return (
    window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
}();

cherry.pool = function (config) {
  'use strict';
  this.config = config || {};
  this.pool = [];
  this.used = 0;
};

cherry.pool.prototype.clear = function () {
  this.pool = [];
  this.used = 0;
};

cherry.pool.prototype.use = function () {

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

cherry.pool.prototype.dismiss = function (obj) {
  // search o and deactivate it
  this.pool.forEach(function (item) {
    if (item.object === obj) {
      item.active = false;
    }
  });
  this.used--;
};

cherry.pool.prototype.size = function () {
  return this.pool.length;
};

cherry.pool.prototype.each = function (fn) {
  var length = this.pool.length;
  var i;
  for (i = 0; i < length; i++) {
    if (this.pool[i].active === true) {
      fn(this.pool[i].object, i);
    }
  }
};

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

cherry.game = function (config) {
  var self = this;
  self.loop = new cherry.loop();
  self.states = new cherry.stateManager(self);

  self.loop.update = function () {
    if (self.states.current !== null) {

      if (!self.states.current.preloaded) {
        self.states.current.preloaded = true;
        self.states.current.preload(self);
      }

      if (!self.states.current.created) {
        self.states.current.created = true;
        self.states.current.create(self);
      }

      if (self.states.current.created) {
        self.states.current.update(self);
      }

    }
  };

};

cherry.state = function (name) {
  this.name = name;
  this.preloaded = false;
  this.created = false;
};

cherry.state.prototype.preload = function () {};

cherry.state.prototype.create = function () {};

cherry.state.prototype.update = function () {};

cherry.stateManager = function (game) {
  this.current = null;
  this.game = game;
  this.states = [];
};

cherry.stateManager.prototype.add = function (state) {
  this.states.push(state);
};

cherry.stateManager.prototype.get = function (stateName) {
  var output = false;
  this.states.forEach(function (state) {
    if (state.name === stateName) {
      output = state;
    }
  });
  return output;
};

cherry.stateManager.prototype.switch = function (stateName) {
  var self = this;
  self.game.loop.nextStep(function () {
    self.current = self.get(stateName);
  });
};

if (typeof module !== 'undefined') {
  module.exports = cherry;
}
