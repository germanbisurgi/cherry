var Game = function () {
  this.loader = new naive.Loader();
  this.loop = new naive.Loop();
  this.state = new naive.StateManager(this);
  this.keys = new naive.Keys(this);
  this.pointers = new naive.Pointers(this);
  this.globals = {};

  this.loop.onStep = function () {
    if (this.state.current !== null) {
      if (!this.state.current.preloaded) {
        this.state.current.preloaded = true;
        this.state.current.preload(this, this.globals);
        this.loader.start();
      }
      if (!this.state.current.created && !this.loader.loading) {
        this.state.current.created = true;
        this.state.current.create(this, this.globals);
      }
      if (this.state.current.created) {
        this.keys.update();
        this.pointers.update();
        this.state.current.update(this, this.globals);
        this.state.current.render(this, this.globals);
      }
    }
  }.bind(this);
};
