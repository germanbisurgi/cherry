comp.stateManager = function (game) {
  this.current = null;
  this.game = game;
  this.states = [];
};

comp.stateManager.prototype.add = function (state) {
  this.states.push(state);
}

comp.stateManager.prototype.get = function (stateName) {
  var output = false;
    this.states.forEach(function (state) {
      if (state.name === stateName) {
        output = state;
      }
    });
    return output;
}

comp.stateManager.prototype.switch = function (stateName) {
  var self = this;
  self.game.loop.nextStep(function () {
    self.current = self.get(stateName);
  });
}