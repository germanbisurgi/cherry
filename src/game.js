cherry.Game = function () {
  this.loop = new cherry.Loop();
  this.state = new cherry.StateManager(this);

  this.loop.onStep = function () {
    if (this.state.current !== null) {

      if (!this.state.current.preloaded) {
        this.state.current.preloaded = true;
        this.state.current.preload(this);
      }

      if (!this.state.current.created) {
        this.state.current.created = true;
        this.state.current.create(this);
      }

      if (this.state.current.created) {
        this.state.current.update(this);
      }

    }
  }.bind(this);

};
