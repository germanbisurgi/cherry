var RenderSystem = function () {
  this.renderables = [];
  this.canvas = new naive.Canvas('.container');
  this.context = this.canvas.context;
};

RenderSystem.prototype.draw = function () {
  this.canvas.clear();
  // render renderables.
};

