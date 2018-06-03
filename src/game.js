comp.game = function (config) {
  var self = this;
  self.loop = new comp.loop();
  self.states = new comp.stateManager(self);
};
