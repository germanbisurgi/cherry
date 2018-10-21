var Game = function () {
  this.loader = new naive.Loader();
  this.loop = new naive.Loop();
  this.state = new naive.StateManager();
  this.keys = new naive.Keys();
  this.pointers = new naive.Pointers();
  this.world = new naive.World();
  this.canvas = new naive.Canvas('.container');
  this.globals = {};

  this.pointers.enablePointers(this.canvas.canvas);

  this.loop.onStep = function () {
    this.state.update();
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
      this.world.update(this.loop.fps);
      this.keys.update(this.loop.delta, this.loop.frame);
      this.pointers.update(this.loop.delta, this.loop.frame);
      this.state.current.update(this, this.globals);
      this.canvas.clear();
      this.world.draw(this.canvas.context);
      this.state.current.render(this, this.globals);
    }
  }.bind(this);
};
