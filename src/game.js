var Game = function () {
  this.loader = new naive.Loader();
  this.loop = new naive.Loop();
  this.state = new naive.StateManager(this);
  this.keys = new naive.Keys(this);
  this.shared = {};

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
        this.keys.update();
        this.state.current.update(this);
      }

    }
  }.bind(this);

};
