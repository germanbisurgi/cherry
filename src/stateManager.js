cherry.StateManager = function (game) {
  this.current = null;
  this.game = game;
  this.states = [];
};

cherry.StateManager.prototype.add = function (state) {
  this.states.push(state);
};

cherry.StateManager.prototype.getByName = function (stateName) {
  var output = false;
  this.states.forEach(function (state) {
    if (state.name === stateName) {
      output = state;
    }
  });
  return output;
};

cherry.StateManager.prototype.switch = function (stateName) {
  this.game.loop.nextStep(function () {
    this.current = this.getByName(stateName);
  }.bind(this));
};
