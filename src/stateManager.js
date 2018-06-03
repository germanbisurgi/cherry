cherry.stateManager = function (game) {
  this.current = null;
  this.game = game;
  this.states = [];
};

cherry.stateManager.prototype.add = function (state) {
  this.states.push(state);
};

cherry.stateManager.prototype.get = function (stateName) {
  var output = false;
  this.states.forEach(function (state) {
    if (state.name === stateName) {
      output = state;
    }
  });
  return output;
};

cherry.stateManager.prototype.switch = function (stateName) {
  var self = this;
  self.game.loop.nextStep(function () {
    self.current = self.get(stateName);
  });
};
