var AssetsSystem = function () {
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

AssetsSystem.prototype.addAudio = function (name, url) {
  var asset = new naive.Asset(name, 'audio', url);
  this.queue.push(asset);
  this.onQueued.dispatch(asset);
};

AssetsSystem.prototype.addAudioBuffer = function (name, url) {
  var asset = new naive.Asset(name, 'audio-buffer', url);
  this.queue.push(asset);
  this.onQueued.dispatch(asset);
};

AssetsSystem.prototype.addImage = function (name, url) {
  var asset = new naive.Asset(name, 'image', url);
  this.queue.push(asset);
  this.onQueued.dispatch(asset);
};

AssetsSystem.prototype.addJSON = function (name, url) {
  var asset = new naive.Asset(name, 'json', url);
  this.queue.push(asset);
  this.onQueued.dispatch(asset);
};

AssetsSystem.prototype.loadAudio = function (asset) {
  var self = this;
  var audio = new Audio();
  audio.oncanplaythrough = function () {
    asset.content = audio;
    self.cache.push(asset);
    self.success++;
    self.onLoad.dispatch(asset);
    self.hasCompleted();
    audio.oncanplaythrough = null;
  };
  audio.onerror = function () {
    self.errors++;
    self.hasCompleted();
  };
  audio.src = asset.url;
};

AssetsSystem.prototype.loadAudioBuffer = function (asset) {
  var self = this;
  var xhr = new window.XMLHttpRequest();
  var AudioContext = new (window.AudioContext || window.webkitAudioContext)();
  xhr.open('GET', asset.url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
    AudioContext.decodeAudioData(this.response, function (buffer) {
      asset.content = buffer;
      self.cache.push(asset);
      self.success++;
      self.onLoad.dispatch(asset);
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

AssetsSystem.prototype.loadImage = function (asset) {
  var self = this;
  var image = new Image();
  image.onload = function () {
    asset.content = image;
    self.cache.push(asset);
    self.success++;
    self.onLoad.dispatch(asset);
    self.hasCompleted();
  };
  image.onerror = function () {
    self.errors++;
    self.hasCompleted();
  };
  image.src = asset.url;
};

AssetsSystem.prototype.loadJSON = function (asset) {
  var xhr = new window.XMLHttpRequest();
  var self = this;
  xhr.open('GET', asset.url, true);
  xhr.onload = function () {
    if (this.status === 200) {
      asset.content = JSON.parse(this.response);
      self.cache.push(asset);
      self.success++;
      self.onLoad.dispatch(asset);
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

AssetsSystem.prototype.get = function (type, name) {
  for (var i = 0, len = this.cache.length; i < len; i++) {
    if (this.cache[i].type === type && this.cache[i].name === name) {
      return this.cache[i];
    }
  }
  return false;
};

AssetsSystem.prototype.getAudioBuffer = function (name) {
  return this.get('audio', name).content;
};

AssetsSystem.prototype.getAudio = function (name) {
  return this.get('audio-buffer', name).content;
};

AssetsSystem.prototype.getImage = function (name) {
  return this.get('image', name).content;
};

AssetsSystem.prototype.getJSON = function (name) {
  return this.get('json', name).content;
};

AssetsSystem.prototype.hasCompleted = function () {
  if (this.queue.length === this.success + this.errors) {
    this.queue = [];
    this.loading = false;
    this.onComplete.dispatch();
    return true;
  } else {
    return false;
  }
};

AssetsSystem.prototype.start = function () {
  if (this.queue.length > 0) {
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
  }
};
