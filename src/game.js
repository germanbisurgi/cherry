cherry.game = function (config) {
  var self = this;
  console.log(self)
  self.loop = new cherry.loop();
  self.states = new cherry.stateManager(self);

  self.loop.update = function () {
    if (self.states.getCurrent() !== null) {

      if (!self.states.getCurrent().preloaded) {
        self.states.getCurrent().preloaded = true;
        self.states.getCurrent().preload(self);
      }

      if (!self.states.getCurrent().created) {
        self.states.getCurrent().created = true;
        self.states.getCurrent().create(self);
      }

      if (self.states.getCurrent().created) {
        self.states.getCurrent().update(self);
      }

    }
  };

};
