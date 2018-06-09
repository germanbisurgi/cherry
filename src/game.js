cherry.game = function () {
  this.loop = new cherry.loop();
  this.states = new cherry.stateManager(this);

  this.loop.update = function () {
    if (this.states.getCurrent() !== null) {

      if (!this.states.getCurrent().preloaded) {
        this.states.getCurrent().preloaded = true;
        this.states.getCurrent().preload(this);
      }

      if (!this.states.getCurrent().created) {
        this.states.getCurrent().created = true;
        this.states.getCurrent().create(this);
      }

      if (this.states.getCurrent().created) {
        this.states.getCurrent().update(this);
      }

    }
  }.bind(this);

};
