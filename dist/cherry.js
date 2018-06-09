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

cherry.game = function () {
  this.loop = new cherry.loop();
  this.states = new cherry.stateManager(this);

  this.loop.update = function () {
    if (this.states.getCurrent() !== null) {

      if (!this.states.getCurrent().preloaded) {
        this.states.getCurrent().preloaded = true;
        this.states.getCurrent().preload(this);
      }

      if (!this.states.getCurrent().created) {
        this.states.getCurrent().created = true;
        this.states.getCurrent().create(this);
      }

      if (this.states.getCurrent().created) {
        this.states.getCurrent().update(this);
      }

    }
  }.bind(this);

};

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
  window.requestAnimationFrame(this.run.bind(this));
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
    window.requestAnimationFrame(this.run.bind(this));
  };
};

cherry.loop.prototype.step = function () {
  this.frame++;
  this.executeQueuedTasks();
  this.update(this.timestep);
};

cherry.loop.prototype.update = function () {};

cherry.pool = function (config) {
  this.config = config || {};
  this.pool = [];
  this.used = 0;
};

cherry.pool.prototype.clear = function () {
  this.pool = [];
  this.used = 0;
};

cherry.pool.prototype.getUsed = function () {
  return this.used;
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

cherry.pool.prototype.getSize = function () {
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

cherry.signal = function () {
  this.test = null;
};

cherry.signal.prototype.getTest = function () {
  return this.test;
};

cherry.state = function (name) {
  this.name = name;
  this.preloaded = false;
  this.created = false;
};

cherry.state.prototype.getName = function () {
  return this.name;
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

cherry.stateManager.prototype.getByName = function (stateName) {
  var output = false;
  this.states.forEach(function (state) {
    if (state.name === stateName) {
      output = state;
    }
  });
  return output;
};

cherry.stateManager.prototype.getCurrent = function () {
  return this.current;
};

cherry.stateManager.prototype.getStates = function () {
  return this.states;
};

cherry.stateManager.prototype.switch = function (stateName) {
  this.game.loop.nextStep(function () {
    this.current = this.getByName(stateName);
  }.bind(this));
};

if (typeof module !== 'undefined') {
  module.exports = cherry;
}
