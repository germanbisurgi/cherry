cherry.stateManager = function (game) {
  this.current = null;
  this.game = game;
  this.states = [];
};

cherry.stateManager.prototype.add = function (state) {
  this.states.push(state);
};

cherry.stateManager.prototype.getByName = function (stateName) {
  var output = false;
  this.states.forEach(function (state) {
    if (state.name === stateName) {
      output = state;
    }
  });
  return output;
};

cherry.stateManager.prototype.getCurrent = function () {
  return this.current;
};

cherry.stateManager.prototype.getStates = function () {
  return this.states;
};

cherry.stateManager.prototype.switch = function (stateName) {
  this.game.loop.nextStep(function () {
    this.current = this.getByName(stateName);
  }.bind(this));
};