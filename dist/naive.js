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
    if (lines.hasOwnProperty(prop)) {
      this.context.fillText(lines[prop], x, y + (this.line * this.fontSize));
      this.line++;
    }
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
  this.onLoad = new naive.Signal();
  this.onComplete = new naive.Signal();
  this.onStart = new naive.Signal();
  this.onQueued = new naive.Signal();
};

Loader.prototype.addAudio = function (name, url) {
  this.queue.push({
    name: name,
    url: url,
    type: 'audio'
  });
  this.onQueued.dispatch();
};

Loader.prototype.addAudioBuffer = function (name, url) {
  this.queue.push({
    name: name,
    url: url,
    type: 'audio-buffer'
  });
  this.onQueued.dispatch();
};

Loader.prototype.addImage = function (name, url) {
  this.queue.push({
    name: name,
    url: url,
    type: 'image'
  });
  this.onQueued.dispatch();
};

Loader.prototype.addJSON = function (name, url) {
  this.queue.push({
    name: name,
    url: url,
    type: 'json'
  });
  this.onQueued.dispatch();
};

Loader.prototype.loadAudio = function (asset) {
  var self = this;
  var audio = new Audio();
  audio.oncanplaythrough = function () {
    var cacheAsset = {
      name: asset.name,
      content: audio,
      type: 'audio'
    };
    self.cache.push(cacheAsset);
    self.success++;
    self.onLoad.dispatch(cacheAsset);
    self.hasCompleted();
    audio.oncanplaythrough = null;
  };
  audio.onerror = function () {
    self.errors++;
    self.hasCompleted();
  };
  audio.src = asset.url;
};

Loader.prototype.loadAudioBuffer = function (asset) {
  var self = this;
  var xhr = new window.XMLHttpRequest();
  var AudioContext = new (window.AudioContext || window.webkitAudioContext)();
  xhr.open('GET', asset.url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
    AudioContext.decodeAudioData(this.response, function (buffer) {
      var cacheAsset = {
        name: asset.name,
        content: buffer,
        type: 'audio-buffer'
      };
      self.cache.push(cacheAsset);
      self.success++;
      self.onLoad.dispatch(cacheAsset);
      self.hasCompleted();
    }, function () {
      self.errors++;
      self.hasCompleted();
    });
  };
  xhr.onerror = function () {
    self.errors++;
    self.hasCompleted();
  };
  xhr.send();
};

Loader.prototype.loadImage = function (asset) {
  var self = this;
  var image = new Image();
  image.onload = function () {
    var cacheAsset = {
      name: asset.name,
      content: image,
      type: 'image'
    };
    self.cache.push(cacheAsset);
    self.success++;
    self.onLoad.dispatch(cacheAsset);
    self.hasCompleted();
  };
  image.onerror = function () {
    self.errors++;
    self.hasCompleted();
  };
  image.src = asset.url;
};

Loader.prototype.loadJSON = function (asset) {
  var xhr = new window.XMLHttpRequest();
  var self = this;
  xhr.open('GET', asset.url, true);
  xhr.onload = function () {
    if (this.status === 200) {
      var cacheAsset = {
        name: asset.name,
        content: JSON.parse(this.response),
        type: 'json'
      };
      self.cache.push(cacheAsset);
      self.success++;
      self.onLoad.dispatch(cacheAsset);
      self.hasCompleted();
    } else {
      self.errors++;
      self.hasCompleted();
    }
  };
  xhr.onerror = function () {
    self.errors++;
    self.hasCompleted();
  };
  xhr.send();
};

Loader.prototype.get = function (type, name) {
  for (var i = 0, len = this.cache.length; i < len; i++) {
    if (this.cache[i].type === type && this.cache[i].name === name) {
      return this.cache[i];
    }
  }
  return false;
};

Loader.prototype.hasCompleted = function () {
  if (this.queue.length === this.success + this.errors) {
    this.queue = [];
    this.onComplete.dispatch();
    return true;
  } else {
    return false;
  }
};

Loader.prototype.start = function () {
  this.onStart.dispatch();
  for (var i = 0, len = this.queue.length; i < len; i++) {
    if (this.queue[i].type === 'audio') {
      this.loadAudio(this.queue[i]);
    }
    if (this.queue[i].type === 'audio-buffer') {
      this.loadAudioBuffer(this.queue[i]);
    }
    if (this.queue[i].type === 'image') {
      this.loadImage(this.queue[i]);
    }
    if (this.queue[i].type === 'json') {
      this.loadJSON(this.queue[i]);
    }
  }
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
  }
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

var Signal = function () {

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
