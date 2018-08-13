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
  this.canvas.width = window.innerWidth * 0.9;
  this.canvas.height = window.innerHeight * 0.9;
  this.canvas.style = 'border: 1px solid pink; margin: 30px;';
};

Canvas.prototype.clear = function () {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Canvas.prototype.image = function (image, x, y, w, h) {
  this.context.drawImage(image, 0, 0, image.width, image.height, x - w / 2, y - h / 2, w, h);
};

Canvas.prototype.text = function (x, y, text) {
  this.context.font = '16px monospace';
  this.context.fillText(text, x, y);
};

var Game = function () {
  this.loader = new naive.Loader();
  this.loop = new naive.Loop();
  this.state = new naive.StateManager(this);
  this.inputs = new naive.Inputs(this);

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
        this.inputs.updateKeys();
        this.inputs.updatePointers();
        this.state.current.update(this);
        this.state.current.render(this);
      }
    }
  }.bind(this);
};

var Inputs = function () {
  this.keys = {};
  this.pointers = [];
  document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
  document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
};

// Keys.

Inputs.prototype.addKey = function (key) {
  this.keys[key] = {
    key: key,
    isDown: false,
    isUp: false,
    isHolded: false,
    holdTime: 0,
    pressFrame: 0,
    releaseFrame: 0
  };
  return this.keys[key];
};

Inputs.prototype.handleKeyDown = function (event) {
  event.preventDefault();
  if (typeof this.keys[event.key] !== 'undefined') {
    this.keys[event.key].isHolded = true;
  }
};

Inputs.prototype.handleKeyUp = function (event) {
  event.preventDefault();
  if (typeof this.keys[event.key] !== 'undefined') {
    this.keys[event.key].isHolded = false;
  }
};

Inputs.prototype.updateKeys = function () {
  for (var i in this.keys) {
    if (!this.keys.hasOwnProperty(i)) {
      continue;
    }
    if (this.keys[i].isHolded) {
      this.keys[i].holdTime += game.loop.delta;
      this.keys[i].releaseFrame = 0;
      if (this.keys[i].pressFrame === 0) {
        this.keys[i].pressFrame = game.loop.frame;
      }
    } else {
      this.keys[i].holdTime = 0;
      this.keys[i].pressFrame = 0;
      if (this.keys[i].releaseFrame === 0) {
        this.keys[i].releaseFrame = game.loop.frame;
      }
    }
    this.keys[i].isDown = (this.keys[i].pressFrame === game.loop.frame);
    this.keys[i].isUp = (this.keys[i].releaseFrame === game.loop.frame);
  }
};

// Pointers.

Inputs.prototype.addPointer = function () {
  var pointer = {
    number: this.pointers.length + 1,
    active: false,
    isHolded: false,
    isDown: false,
    isUp: false,
    holdTime: 0,
    pressFrame: 0,
    releaseFrame: 0,
    id: 0,
    x: 100,
    y: 100
  };
  this.pointers.unshift(pointer);
  return pointer;
};

Inputs.prototype.enablePointers = function (element) {
  element.style.touchAction = 'none';
  element.addEventListener('pointerdown', this.handlePointerDown.bind(this), false);
  element.addEventListener('pointermove', this.handlePointerMove.bind(this), false);
  element.addEventListener('pointerup', this.handlePointerUpAndCancel.bind(this), false);
  element.addEventListener('pointercancel', this.handlePointerUpAndCancel.bind(this), false);
};

Inputs.prototype.getPointerByID = function (id) {
  var output = false;
  this.pointers.forEach(function (pointer) {
    if (pointer.id === id) {
      output = pointer;
    }
  });
  return output;
};

Inputs.prototype.getInactivePointer = function () {
  var output = false;
  this.pointers.forEach(function (pointer) {
    if (pointer.active === false) {
      output = pointer;
    }
  });
  return output;
};

Inputs.prototype.handlePointerDown = function (event) {
  event.preventDefault();
  var pointer = this.getPointerByID(event.pointerId) || this.getInactivePointer();
  pointer.active = true;
  pointer.id = event.pointerId;
  pointer.isHolded = true;
  pointer.x = event.clientX - event.target.offsetLeft;
  pointer.y = event.clientY - event.target.offsetTop;
};

Inputs.prototype.handlePointerMove = function (event) {
  event.preventDefault();
  var pointer = this.getPointerByID(event.pointerId) || this.getInactivePointer();
  pointer.active = true;
  pointer.id = event.pointerId;
  pointer.x = event.clientX - event.target.offsetLeft;
  pointer.y = event.clientY - event.target.offsetTop;
};

Inputs.prototype.handlePointerUpAndCancel = function (event) {
  event.preventDefault();
  var pointer = this.getPointerByID(event.pointerId);
  pointer.active = false;
  pointer.isHolded = false;
};

Inputs.prototype.updatePointers = function (event) {
  this.pointers.forEach(function (pointer) {
    if (pointer.isHolded) {
      pointer.holdTime += game.loop.delta;
      pointer.releaseFrame = 0;
      if (pointer.pressFrame === 0) {
        pointer.pressFrame = game.loop.frame;
      }
    } else {
      pointer.holdTime = 0;
      pointer.pressFrame = 0;
      if (pointer.releaseFrame === 0) {
        pointer.releaseFrame = game.loop.frame;
      }
    }
    pointer.isDown = (pointer.pressFrame === game.loop.frame);
    pointer.isUp = (pointer.releaseFrame === game.loop.frame);

  }.bind(this));
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
  var args = Array.prototype.slice.call(arguments);

  // get a free object
  var unusedItem = false;
  this.pool.forEach(function (item) {
    if (item.active === false) {
      unusedItem = item;
    }
  });

  // if free object init and reuse it
  if (unusedItem) {
    this.reset(unusedItem.object, ...args);
    unusedItem.active = true;
    this.used++;
    return unusedItem.object;
  }

  // if no free object creates one
  var item = {
    active: true,
    object: new this.cls(...args)
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

State.prototype.render = function () {};

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
  Inputs: Inputs,
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
