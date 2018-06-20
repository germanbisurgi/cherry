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

var Debug = function (context) {
  this.context = context;
  this.fontSize = 15;
  this.line = 1;
};

Debug.prototype.print = function (x, y, lines) {
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

var Game = function () {
  this.loader = new naive.Loader();
  this.loop = new naive.Loop();
  this.state = new naive.StateManager(this);

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

var Loader = function () {
  this.errors = 0;
  this.success = 0;
  this.queue = [];
  this.cache = [];
  this.xhr = new window.XMLHttpRequest();
};

Loader.prototype.loadAudio = function (url) {
  return new Promise(function (resolve, reject) {
    var audio = new Audio();
    audio.oncanplaythrough = function () {
      resolve(audio);
    };
    audio.onerror = function () {
      reject('error');
    };
    audio.src = url;
  });
};

Loader.prototype.loadAudioBuffer = function (url) {
  var AudioContext = new (window.AudioContext || window.webkitAudioContext);
  return new Promise(function (resolve, reject) {
    this.xhr.open('GET', url, true);
    this.xhr.responseType = 'arraybuffer';
    this.xhr.onload = function () {
      AudioContext.decodeAudioData(this.response, function (buffer) {
        resolve(buffer);
      }, function () {
        reject(this.statusText);
      });
    };
    this.xhr.onerror = function () {
      reject(this.statusText);
    };
    this.xhr.send();
  }.bind(this));
};

Loader.prototype.loadImage = function (url) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.onload = function () {
      resolve(image);
    };
    image.onerror = function () {
      reject('error');
    };
    image.src = url;
  });
};

Loader.prototype.loadJSON = function (url) {
  return new Promise(function (resolve, reject) {
    this.xhr.open('GET', url, true);
    this.xhr.onload = function () {
      if (this.status === 200) {
        resolve(JSON.parse(this.response));
      } else {
        reject(this.statusText);
      }
    };
    this.xhr.onerror = function () {
      reject(this.statusText);
    };
    this.xhr.send();
  }.bind(this));
};

var Loop = function () {
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

  this.queuedTasks = new naive.Pool(queuedTask, function (object, fn) {
    object.execute = fn;
  });

};

Loop.prototype.executeQueuedTasks = function () {
  this.queuedTasks.each(function (task) {
    task.execute();
    this.queuedTasks.dismiss(task);
  }.bind(this));
};

Loop.prototype.nextStep = function (task) {
  this.queuedTasks.use(task);
};

Loop.prototype.start = function () {
  this.status = 'on';
  window.requestAnimationFrame(this.run.bind(this));
};

Loop.prototype.run = function (timestamp) {
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

Loop.prototype.step = function () {
  this.frame++;
  this.executeQueuedTasks();
  this.onStep();
};

Loop.prototype.onStep = function () {};

var Pool = function (cls, reset) {
  this.cls = cls;
  this.pool = [];
  this.reset = reset;
  this.size = 0;
  this.used = 0;
};

Pool.prototype.clear = function () {
  this.pool = [];
  this.used = 0;
  this.size = 0;
};

Pool.prototype.dismiss = function (obj) {
  this.pool.forEach(function (item) {
    if (item.object === obj) {
      item.active = false;
    }
  });
  this.used--;
};

Pool.prototype.each = function (fn) {
  var length = this.pool.length;
  var i;
  for (i = 0; i < length; i++) {
    if (this.pool[i].active === true) {
      fn(this.pool[i].object, i);
    }
  }
};

Pool.prototype.use = function () {

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
    this.used++;
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

var Signal = function (context) {

  this.enabled = true;

  var Listener = function (fn, once, prio) {
    this.execute = fn;
    this.once = once || false;
    this.prio = prio || 0;
  };

  this.listeners = new naive.Pool(Listener, function (object, fn, once, prio) {
    object.execute = fn;
    object.once = once || false;
    object.prio = prio || 0;
  });

};

Signal.prototype.add = function (fn, prio) {
  if (this.has(fn)) {
    return false;
  } else {
    this.listeners.use(fn, false, prio);
    this.listeners.pool.sort(function (a, b) {
      return (b.object.prio - a.object.prio);
    });
  }
};

Signal.prototype.addOnce = function (fn, prio) {
  if (this.has(fn)) {
    return false;
  } else {
    this.listeners.use(fn, true, prio);
    this.listeners.pool.sort(function (a, b) {
      return (b.object.prio - a.object.prio);
    });
  }
};

Signal.prototype.dispatch = function () {
  if (this.enabled === false) {
    return;
  }

  var args = Array.prototype.slice.call(arguments);

  this.listeners.each(function (listener) {
    listener.execute.apply(listener, args);
    if (listener.once === true) {
      this.listeners.dismiss(listener);
    }
  }.bind(this));
};

Signal.prototype.has = function (listener) {
  var output = false;
  this.listeners.each(function (activeListener) {
    if (activeListener.execute === listener) {
      output = true;
    }
  });
  return output;
};

Signal.prototype.remove = function (listener) {
  this.listeners.each(function (activeListener) {
    if (activeListener.execute === listener) {
      this.listeners.dismiss(activeListener);
    }
  }.bind(this));
};

Signal.prototype.removeAll = function () {
  this.listeners.clear();
};

var State = function (name) {
  this.name = name;
  this.preloaded = false;
  this.created = false;
};

State.prototype.preload = function () {};

State.prototype.create = function () {};

State.prototype.update = function () {};

var StateManager = function (game) {
  this.current = null;
  this.game = game;
  this.states = [];
};

StateManager.prototype.add = function (state) {
  this.states.push(state);
};

StateManager.prototype.getByName = function (stateName) {
  var output = false;
  this.states.forEach(function (state) {
    if (state.name === stateName) {
      output = state;
    }
  });
  return output;
};

StateManager.prototype.switch = function (stateName) {
  this.game.loop.nextStep(function () {
    this.current = this.getByName(stateName);
  }.bind(this));
};

var naive = {
  Debug: Debug,
  Game: Game,
  Loader: Loader,
  Loop: Loop,
  Pool: Pool,
  Signal: Signal,
  State: State,
  StateManager: StateManager
};

if (typeof module !== 'undefined') {
  module.exports = naive;
}
