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
