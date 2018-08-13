var Game = function () {
  this.loader = new naive.Loader();
  this.loop = new naive.Loop();
  this.state = new naive.StateManager(this);
  this.inputs = new naive.Inputs(this);

  this.loop.onStep = function () {
    if (this.state.current !== null) {
      if (!this.state.current.preloaded) {
        this.state.current.preloaded = true;
        this.state.current.preload(this);
        this.loader.start();
      }
      if (!this.state.current.created && !this.loader.loading) {
        this.state.current.created = true;
        this.state.current.create(this);
      }
      if (this.state.current.created) {
        this.inputs.updateKeys();
        this.inputs.updatePointers();
        this.state.current.update(this);
        this.state.current.render(this);
      }
    }
  }.bind(this);
};
