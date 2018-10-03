var Keys = function () {
  this.keys = {};
  document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
  document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
};

Keys.prototype.add = function (key) {
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

Keys.prototype.handleKeyDown = function (event) {
  event.preventDefault();
  if (typeof this.keys[event.key] !== 'undefined') {
    this.keys[event.key].isHolded = true;
  }
};

Keys.prototype.handleKeyUp = function (event) {
  event.preventDefault();
  if (typeof this.keys[event.key] !== 'undefined') {
    this.keys[event.key].isHolded = false;
  }
};

Keys.prototype.updateKeys = function () {
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

Keys.prototype.update = function () {
  this.updateKeys();
};
