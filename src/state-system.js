var StateSystem = function (game) {
  this.current = null;
  this.game = game;
  this.states = [];
  this.requested = null;
};

StateSystem.prototype.add = function (state) {
  this.states.push(state);
};

StateSystem.prototype.getByName = function (stateName) {
  var output = false;
  this.states.forEach(function (state) {
    if (state.name === stateName) {
      output = state;
    }
  });
  return output;
};

StateSystem.prototype.switch = function (stateName) {
  this.requested = stateName;
};

StateSystem.prototype.update = function () {
  if (this.requested) {
    this.current = this.getByName(this.requested);
    this.requested = null;
  }
};
