cherry.state = function (name) {
  this.name = name;
  this.preloaded = false;
  this.created = false;
};

cherry.state.prototype.preload = function () {};

cherry.state.prototype.create = function () {};

cherry.state.prototype.update = function () {};
