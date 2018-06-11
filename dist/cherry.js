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
  this.state = new cherry.StateManager(this);

  this.loop.onStep = function () {
    if (this.state.current !== null) {

      if (!this.state.current.preloaded) {
        this.state.current.preloaded = true;
        this.state.current.preload(this);
      }

      if (!this.state.current.created) {
        this.state.current.created = true;
        this.state.current.create(this);
      }

      if (this.state.current.created) {
        this.state.current.update(this);
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

cherry.Pool = function (cls, reset) {
  this.cls = cls;
  this.pool = [];
  this.reset = reset;
  this.size = 0;
  this.used = 0;
};

cherry.Pool.prototype.clear = function () {
  this.pool = [];
  this.used = 0;
  this.size = 0;
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
    var args = Array.prototype.slice.call(arguments);
    this.reset.apply(this.reset, args);
    unusedItem.active = true;
    return unusedItem.object;
  }

  // if no free object creates one
  var item = {
    active: true,
    object: new (Function.prototype.bind.apply(this.cls, [null].concat(Array.prototype.slice.call(arguments))))()
  };
  this.pool.push(item);
  this.used++;
  this.size++;
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

cherry.Pool.prototype.each = function (fn) {
  var length = this.pool.length;
  var i;
  for (i = 0; i < length; i++) {
    if (this.pool[i].active === true) {
      fn(this.pool[i].object, i);
    }
  }
};

cherry.Signal = function (context) {

  var Listener = function (fn, once) {
    this.once = once || false;
    this.execute = fn;
  };

  this.listeners = new cherry.Pool(Listener, function (object, fn, once) {
    object.once = once || false;
    object.execute = fn;
  });

};

cherry.Signal.prototype.add = function (fn) {
  this.listeners.use(fn, false);
};

cherry.Signal.prototype.addOnce = function (fn) {
  this.listeners.use(fn, true);
};

cherry.Signal.prototype.dispatch = function () {
  var args = Array.prototype.slice.call(arguments);
  this.listeners.each(function (listener) {
    listener.execute.apply(listener, args);
    if (listener.once === true) {
      this.listeners.dismiss(listener);
    }
  }.bind(this));
};

cherry.Signal.prototype.remove = function (listener) {
  this.listeners.dismiss(listener);
};

cherry.State = function (name) {
  this.name = name;
  this.preloaded = false;
  this.created = false;
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

cherry.StateManager.prototype.switch = function (stateName) {
  this.game.loop.nextStep(function () {
    this.current = this.getByName(stateName);
  }.bind(this));
};

if (typeof module !== 'undefined') {
  module.exports = cherry;
}
