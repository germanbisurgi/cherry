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
