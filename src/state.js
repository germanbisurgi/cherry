comp.state = function (name) {
  this.name = name;
  this.preloaded = false;
  this.created = false;
};

comp.state.prototype.preload = function () {};

comp.state.prototype.create = function () {};

comp.state.prototype.update = function () {};
