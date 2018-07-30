var Keys = function (game) {
  this.tracked = {};
  document.addEventListener('keydown', this.trackKey.bind(this), false);
  document.addEventListener('keyup', this.untrackKey.bind(this), false);
};

Keys.prototype.add = function (key) {
  this.tracked[key] = {
    key: key,
    pressed: false,
    pressing: false,
    released: false,
    pressFrame: 0,
    releaseFrame: 0,
    holdTime: 0
  };
  return this.tracked[key];
};

Keys.prototype.trackKey = function (event) {
  event.preventDefault();
  if (typeof this.tracked[event.key] === 'undefined') {
    this.add(event.key);
  }
  this.tracked[event.key].pressing = true;
};

Keys.prototype.untrackKey = function (event) {
  event.preventDefault();
  this.tracked[event.key].pressing = false;
};

Keys.prototype.update = function () {
  for (var i in this.tracked) {
    if (!this.tracked.hasOwnProperty(i)) {
      continue;
    }
    if (this.tracked[i].pressing) {
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
    this.tracked[i].pressed = (this.tracked[i].pressFrame === game.loop.frame);
    this.tracked[i].released = (this.tracked[i].releaseFrame === game.loop.frame);
  }
};

Keys.prototype.onPress = function (keys, fn) {
  var output = true;
  keys.forEach(function (key) {
    if (this.tracked.hasOwnProperty(key)) {
      if (this.tracked[key].pressed) {
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
      if (this.tracked[key].pressing) {
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

Keys.prototype.onRelease = function (keys, fn) {
  var output = true;
  keys.forEach(function (key) {
    if (this.tracked.hasOwnProperty(key)) {
      if (this.tracked[key].released) {
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
