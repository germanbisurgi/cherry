comp.game = function (config) {
  var self = this;
  self.loop = new comp.loop();
  self.states = new comp.stateManager(self);

  self.loop.update = function () {

    if (!self.states.current.preloaded) {
      self.states.current.preloaded = true;
      self.states.current.preload(self);
    }

    if (!self.states.current.created) {
      self.states.current.created = true;
      self.states.current.create(self);
    }

    if (self.states.current.created) {
      self.states.current.update(self);
    }
  };

};
