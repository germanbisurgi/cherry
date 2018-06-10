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

cherry.Debug = function (context) {
  this.context = context;
  this.fontSize = 15;
  this.line = 1;
};

cherry.Debug.prototype.print = function (x, y, lines) {
  this.context.save();
  this.context.font = this.fontSize + 'px monospace';
  this.context.textAlign = 'start';
  for (var prop in lines) {
    this.context.fillText(lines[prop], x, y + (this.line * this.fontSize));
    this.line++;
  }
  this.context.restore();
  this.line = 1;
};

cherry.Game = function () {
  this.loop = new cherry.Loop();
  this.states = new cherry.StateManager(this);

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

cherry.Pool = function (config) {
  this.config = config || {};
  this.pool = [];
  this.used = 0;
};

cherry.Pool.prototype.clear = function () {
  this.pool = [];
  this.used = 0;
};

cherry.Pool.prototype.getUsed = function () {
  return this.used;
};

cherry.Pool.prototype.use = function () {

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

cherry.Pool.prototype.dismiss = function (obj) {
  // search o and deactivate it
  this.pool.forEach(function (item) {
    if (item.object === obj) {
      item.active = false;
    }
  });
  this.used--;
};

cherry.Pool.prototype.getSize = function () {
  return this.pool.length;
};

cherry.Pool.prototype.each = function (fn) {
  var length = this.pool.length;
  var i;
  for (i = 0; i < length; i++) {
    if (this.pool[i].active === true) {
      fn(this.pool[i].object, i);
    }
  }
};

cherry.State = function (name) {
  this.name = name;
  this.preloaded = false;
  this.created = false;
};

cherry.State.prototype.getName = function () {
  return this.name;
};

cherry.State.prototype.preload = function () {};

cherry.State.prototype.create = function () {};

cherry.State.prototype.update = function () {};

cherry.StateManager = function (game) {
  this.current = null;
  this.game = game;
  this.states = [];
};

cherry.StateManager.prototype.add = function (state) {
  this.states.push(state);
};

cherry.StateManager.prototype.getByName = function (stateName) {
  var output = false;
  this.states.forEach(function (state) {
    if (state.name === stateName) {
      output = state;
    }
  });
  return output;
};

cherry.StateManager.prototype.getCurrent = function () {
  return this.current;
};

cherry.StateManager.prototype.getStates = function () {
  return this.states;
};

cherry.StateManager.prototype.switch = function (stateName) {
  this.game.loop.nextStep(function () {
    this.current = this.getByName(stateName);
  }.bind(this));
};

if (typeof module !== 'undefined') {
  module.exports = cherry;
}
