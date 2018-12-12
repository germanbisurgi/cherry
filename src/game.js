var Game = function () {
  this.assets = new naive.AssetsSystem();
  this.loop = new naive.Loop(this);
  this.state = new naive.StateSystem(this);
  this.physics = new naive.PhysicsSystem(this);
  this.calc = new naive.Calc();
  this.camera = new naive.Camera(this);
  this.canvas = new naive.Canvas(this);
  this.keys = new naive.KeysSystem(this);
  this.pointers = new naive.PointersSystem(this);
  this.globals = {};

  this.loop.onStep = function () {
    this.state.update();
    if (!this.state.current.preloaded) {
      this.state.current.preloaded = true;
      this.state.current.preload(this, this.globals);
      this.assets.load();
    }
    if (!this.state.current.created && !this.assets.loading) {
      this.state.current.created = true;
      this.state.current.create(this, this.globals);
    }
    if (this.state.current.created) {
      // update
      this.keys.update(this.loop.delta, this.loop.frame);
      this.pointers.update(this.loop.delta, this.loop.frame);
      this.physics.update(this.loop.fps);
      this.state.current.update(this, this.globals);
      // draw
      // this.render.draw();
      this.physics.draw();
      this.state.current.render(this, this.globals);
    }
  }.bind(this);
};
