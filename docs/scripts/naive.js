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

var Calc = function () {};

Calc.prototype.angleToPoint = function (point, angle, radius) {
  return {
    x: Math.cos(angle) * radius + point.x,
    y: Math.sin(angle) * radius + point.y
  };
};

Calc.prototype.clamp = function (value, min, max) {
  return Math.min(Math.max(value, min), max);
};

Calc.prototype.degreesToRadians = function (degrees) {
  return degrees / 180 * Math.PI;
};

Calc.prototype.distance = function (a, b) {
  return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
};

Calc.prototype.lerp = function (norm, min, max) {
  return (max - min) * norm + min;
};

Calc.prototype.map = function (value, sourceMin, sourceMax, destMin, destMax) {
  return this.lerp(this.norm(value, sourceMin, sourceMax), destMin, destMax);
};

Calc.prototype.norm = function (value, min, max) {
  return (value - min) / (max - min);
};

Calc.prototype.angleBetweenPoints = function (p1, p2) {
  var theta = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  if (theta < 0) {
    theta += 6.283185307179586;
  }
  return theta;
};

Calc.prototype.radiansToDegrees = function (radians) {
  return radians * 180 / Math.PI;
};

Calc.prototype.randomRange = function (min, max) {
  return min + Math.random() * (max - min);
};

Calc.prototype.randomInt = function (min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
};

var Canvas = function (container) {
  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  if (typeof container !== 'undefined') {
    this.container = document.querySelector(container);
    this.container.appendChild(this.canvas);
  }
};

Canvas.prototype.clear = function () {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Canvas.prototype.image = function (image, x, y) {
  this.context.drawImage(image, x, y);
};

Canvas.prototype.text = function (x, y, text) {
  this.context.font = '16px monospace';
  this.context.fillText(text, x, y);
};

var Game = function () {
  this.loader = new naive.Loader();
  this.loop = new naive.Loop();
  this.state = new naive.StateManager(this);
  this.keys = new naive.Keys(this);
  this.pointers = new naive.Pointers(this);
  this.shared = {};

  this.loop.onStep = function () {
    if (this.state.current !== null) {

      if (!this.state.current.preloaded) {
        this.state.current.preloaded = true;
        this.state.current.preload(this);
        this.loader.start();
      }

      if (!this.state.current.created && !this.loader.loading) {
        this.state.current.created = true;
        this.state.current.create(this);
      }

      if (this.state.current.created) {
        this.keys.update();
        this.state.current.update(this);
        this.state.current.render(this);
      }

    }
  }.bind(this);

};

var Keys = function (game) {
  this.tracked = {};
  document.addEventListener('keydown', this.keydownHandler.bind(this), false);
  document.addEventListener('keyup', this.keyupHandler.bind(this), false);
};

Keys.prototype.add = function (key) {
  this.tracked[key] = {
    key: key,
    pressed: false,
    pressing: false,
    released: false,
    holdTime: 0,
    pressFrame: 0,
    releaseFrame: 0
  };
  return this.tracked[key];
};

Keys.prototype.keydownHandler = function (event) {
  if (typeof this.tracked[event.key] === 'undefined') {
    return;
  };
  event.preventDefault();
  this.tracked[event.key].pressing = true;
  if (this.tracked[event.key].pressFrame === 0) {
    this.tracked[event.key].pressFrame = game.loop.frame;
  }
};

Keys.prototype.keyupHandler = function (event) {
  if (typeof this.tracked[event.key] === 'undefined') {
    return;
  };
  event.preventDefault();
  this.tracked[event.key].pressing = false;
  this.tracked[event.key].released = true;
  this.tracked[event.key].releaseFrame = game.loop.frame;
};

Keys.prototype.update = function () {
  for (var key in this.tracked) {
    this.tracked[key].holdTime = this.tracked[key].pressing ? this.tracked[key].holdTime = this.tracked[key].holdTime + game.loop.delta : 0;
    this.tracked[key].released = this.tracked[key].releaseFrame === game.loop.frame - 2;
    this.tracked[key].pressed = this.tracked[key].pressFrame === game.loop.frame - 2;
  }
};

var Loader = function () {
  this.loaded = false;
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
  var asset = {
    name: name,
    type: 'audio',
    url: url
  };
  this.queue.push(asset);
  this.onQueued.dispatch(asset);
};

Loader.prototype.addAudioBuffer = function (name, url) {
  var asset = {
    name: name,
    type: 'audio-buffer',
    url: url
  };
  this.queue.push(asset);
  this.onQueued.dispatch(asset);
};

Loader.prototype.addImage = function (name, url) {
  var asset = {
    name: name,
    type: 'image',
    url: url
  };
  this.queue.push(asset);
  this.onQueued.dispatch(asset);
};

Loader.prototype.addJSON = function (name, url) {
  var asset = {
    name: name,
    type: 'json',
    url: url
  };
  this.queue.push(asset);
  this.onQueued.dispatch(asset);
};

Loader.prototype.loadAudio = function (asset) {
  var self = this;
  var audio = new Audio();
  audio.oncanplaythrough = function () {
    var cacheAsset = {
      name: asset.name,
      type: 'audio',
      content: audio
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
        type: 'audio-buffer',
        content: buffer
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
      type: 'image',
      content: image
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
        type: 'json',
        content: JSON.parse(this.response)
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

Loader.prototype.getAudioBuffer = function (name) {
  return this.get('audio', name).content;
};

Loader.prototype.getAudio = function (name) {
  return this.get('audio-buffer', name).content;
};

Loader.prototype.getImage = function (name) {
  return this.get('image', name).content;
};

Loader.prototype.getJSON = function (name) {
  return this.get('json', name).content;
};

Loader.prototype.hasCompleted = function () {
  if (this.queue.length === this.success + this.errors) {
    this.queue = [];
    this.loading = false;
    this.onComplete.dispatch();
    return true;
  } else {
    return false;
  }
};

Loader.prototype.start = function () {
  this.loading = true;
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

var Pointers = function (game) {
  this.ongoingTouches = [];
  window.addEventListener('pointerdown', this.handleStart.bind(this), false);
  window.addEventListener('pointerup', this.handleEnd.bind(this), false);
  window.addEventListener('pointercancel', this.handleCancel.bind(this), false);
  window.addEventListener('pointermove', this.handleMove.bind(this), false);
};

Pointers.prototype.handleStart = function (event) {
  this.processEvent(event);
};

Pointers.prototype.handleEnd = function (event) {
  this.processEvent(event);
};

Pointers.prototype.handleCancel = function (event) {
  this.processEvent(event);
};

Pointers.prototype.handleMove = function (event) {
  this.processEvent(event);
};

Pointers.prototype.processEvent = function (event) {
  event.preventDefault();
  var pointer = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    type: event.pointerType,
    event: event.type
  };
  // console.log(event.type, pointer);
};

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
  Calc: Calc,
  Canvas: Canvas,
  Game: Game,
  Keys: Keys,
  Loader: Loader,
  Loop: Loop,
  Pointers: Pointers,
  Pool: Pool,
  Signal: Signal,
  State: State,
  StateManager: StateManager
};

if (typeof module !== 'undefined') {
  module.exports = naive;
}
