var StateManager = function (game) {
  this.current = null;
  this.game = game;
  this.states = [];
  this.requested = null;
};

StateManager.prototype.add = function (state) {
  this.states.push(state);
};

StateManager.prototype.getByName = function (stateName) {
  var output = false;
  this.states.forEach(function (state) {
    if (state.name === stateName) {
      output = state;
    }
  });
  return output;
};

StateManager.prototype.switch = function (stateName) {
  this.requested = stateName;
};

StateManager.prototype.update = function () {
  if (this.requested) {
    this.current = this.getByName(this.requested);
    this.requested = null;
  }
};
