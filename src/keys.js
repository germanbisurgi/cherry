var Keys = function (game) {
  this.tracked = {};
  document.addEventListener('keydown', this.trackKey.bind(this), false);
  document.addEventListener('keyup', this.untrackKey.bind(this), false);
};

Keys.prototype.add = function (key) {
  this.tracked[key] = {
    key: key,
    isDown: false,
    isUp: false,
    isHolded: false,
    holdTime: 0,
    pressFrame: 0,
    releaseFrame: 0
  };
  return this.tracked[key];
};

Keys.prototype.trackKey = function (event) {
  event.preventDefault();
  if (typeof this.tracked[event.key] === 'undefined') {
    this.add(event.key);
  }
  this.tracked[event.key].isHolded = true;
};

Keys.prototype.untrackKey = function (event) {
  event.preventDefault();
  this.tracked[event.key].isHolded = false;
};

Keys.prototype.update = function () {
  for (var i in this.tracked) {
    if (!this.tracked.hasOwnProperty(i)) {
      continue;
    }
    if (this.tracked[i].isHolded) {
      this.tracked[i].holdTime += game.loop.delta;
      this.tracked[i].releaseFrame = 0;
      if (this.tracked[i].pressFrame === 0) {
        this.tracked[i].pressFrame = game.loop.frame;
      }
    } else {
      this.tracked[i].holdTime = 0;
      this.tracked[i].pressFrame = 0;
      if (this.tracked[i].releaseFrame === 0) {
        this.tracked[i].releaseFrame = game.loop.frame;
      }
    }
    this.tracked[i].isDown = (this.tracked[i].pressFrame === game.loop.frame);
    this.tracked[i].isUp = (this.tracked[i].releaseFrame === game.loop.frame);
  }
};

Keys.prototype.onDown = function (keys, fn) {
  var output = true;
  keys.forEach(function (key) {
    if (this.tracked.hasOwnProperty(key)) {
      if (this.tracked[key].isDown) {
      } else {
        output = false;
      }
    } else {
      output = false;
    }
  }.bind(this));
  if (output) {
    fn();
  }
};

Keys.prototype.onHold = function (keys, fn) {
  var output = true;
  var holdTime = true;
  keys.forEach(function (key) {
    if (this.tracked.hasOwnProperty(key)) {
      if (this.tracked[key].isHolded) {
        holdTime = this.tracked[key].holdTime;
      } else {
        output = false;
      }
    } else {
      output = false;
    }
  }.bind(this));
  if (output) {
    fn(holdTime);
  }
};

Keys.prototype.onUp = function (keys, fn) {
  var output = true;
  keys.forEach(function (key) {
    if (this.tracked.hasOwnProperty(key)) {
      if (this.tracked[key].isUp) {
      } else {
        output = false;
      }
    } else {
      output = false;
    }
  }.bind(this));
  if (output) {
    fn();
  }
};
