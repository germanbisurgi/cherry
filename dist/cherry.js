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

cherry.game = function (config) {
  var self = this;
  self.loop = new cherry.loop();
  self.states = new cherry.stateManager(self);

  self.loop.update = function () {
    if (self.states.getCurrent() !== null) {

      if (!self.states.getCurrent().preloaded) {
        self.states.getCurrent().preloaded = true;
        self.states.getCurrent().preload(self);
      }

      if (!self.states.getCurrent().created) {
        self.states.getCurrent().created = true;
        self.states.getCurrent().create(self);
      }

      if (self.states.getCurrent().created) {
        self.states.getCurrent().update(self);
      }

    }
  };

};

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
  var self = this;
  self.current = null;
  self.states = [];

  cherry.stateManager.prototype.add = function (state) {
    self.states.push(state);
  };

  cherry.stateManager.prototype.getByName = function (stateName) {
    var output = false;
    self.states.forEach(function (state) {
      if (state.name === stateName) {
        output = state;
      }
    });
    return output;
  };

  cherry.stateManager.prototype.getCurrent = function () {
    return self.current;
  };

  cherry.stateManager.prototype.getStates = function () {
    return self.states;
  };

  cherry.stateManager.prototype.switch = function (stateName) {
    game.loop.nextStep(function () {
      self.current = self.getByName(stateName);
    });
  };
};

if (typeof module !== 'undefined') {
  module.exports = cherry;
}
