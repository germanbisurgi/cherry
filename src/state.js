cherry.State = function (name) {
  this.name = name;
  this.preloaded = false;
  this.created = false;
};

cherry.State.prototype.getName = function () {
  return this.name;
};

cherry.State.prototype.preload = function () {};

cherry.State.prototype.create = function () {};

cherry.State.prototype.update = function () {};
