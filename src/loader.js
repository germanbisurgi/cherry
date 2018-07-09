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
