var Loader = function () {
  this.errors = 0;
  this.success = 0;
  this.queue = [];
  this.cache = [];
  this.xhr = new window.XMLHttpRequest();
  this.onAssetLoaded = new naive.Signal();
};

Loader.prototype.addAudio = function (name, url) {
  this.queue.push({
    name: name,
    url: url,
    type: 'audio'
  });
};

Loader.prototype.addImage = function (name, url) {
  this.queue.push({
    name: name,
    url: url,
    type: 'image'
  });
};

Loader.prototype.addJSON = function (name, url) {
  this.queue.push({
    name: name,
    url: url,
    type: 'json'
  });
};

Loader.prototype.loadAudio = function (url) {
  var self = this;
  return new Promise(function (resolve, reject) {
    var audio = new Audio();
    audio.oncanplaythrough = function () {
      resolve(audio);
      self.cache.push(audio); // ACHTUNG
      self.onAssetLoaded.dispatch();
    };
    audio.onerror = function () {
      reject('error');
    };
    audio.src = url;
  });
};

Loader.prototype.loadAudioBuffer = function (url) {
  var AudioContext = new (window.AudioContext || window.webkitAudioContext)();
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
  var self = this;
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.onload = function () {
      resolve(image);
      self.cache.push(image); // ACHTUNG
      self.onAssetLoaded.dispatch();
    };
    image.onerror = function () {
      reject('error');
    };
    image.src = url;
  });
};

Loader.prototype.loadJSON = function (url) {
  var self = this;
  return new Promise(function (resolve, reject) {
    this.xhr.open('GET', url, true);
    this.xhr.onload = function () {
      if (this.status === 200) {
        var parsedJSON = JSON.parse(this.response);
        resolve(parsedJSON);
        self.cache.push(parsedJSON); // ACHTUNG
        self.onAssetLoaded.dispatch();
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
