var Keys = function () {
  this.keys = {};
  document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
  document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
};

Keys.prototype.add = function (key) {
  this.keys[key] = {
    key: key,
    start: false,
    end: false,
    hold: false,
    holdTime: 0,
    startFrame: 0,
    endFrame: 0
  };
  return this.keys[key];
};

Keys.prototype.handleKeyDown = function (event) {
  event.preventDefault();
  if (typeof this.keys[event.key] !== 'undefined') {
    this.keys[event.key].hold = true;
  }
};

Keys.prototype.handleKeyUp = function (event) {
  event.preventDefault();
  if (typeof this.keys[event.key] !== 'undefined') {
    this.keys[event.key].hold = false;
  }
};

Keys.prototype.updateKeys = function () {
  for (var i in this.keys) {
    if (!this.keys.hasOwnProperty(i)) {
      continue;
    }
    if (this.keys[i].hold) {
      this.keys[i].holdTime += game.loop.delta;
      this.keys[i].endFrame = 0;
      if (this.keys[i].startFrame === 0) {
        this.keys[i].startFrame = game.loop.frame;
      }
    } else {
      this.keys[i].holdTime = 0;
      this.keys[i].startFrame = 0;
      if (this.keys[i].endFrame === 0) {
        this.keys[i].endFrame = game.loop.frame;
      }
    }
    this.keys[i].start = (this.keys[i].startFrame === game.loop.frame);
    this.keys[i].end = (this.keys[i].endFrame === game.loop.frame);
  }
};

Keys.prototype.update = function () {
  this.updateKeys();
};
