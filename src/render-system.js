var RenderSystem = function () {
  this.renderables = [];
  this.canvas = new naive.Canvas('.container');
  this.context = this.canvas.context;
};

RenderSystem.prototype.addRenderable = function (image, x, y, width, height, angle) {
  var renderable = new naive.Renderable(image, x, y, width, height, angle);
  this.renderables.push(renderable);
  return renderable;
};

RenderSystem.prototype.draw = function () {
  this.canvas.clear();
  this.renderables.forEach(function (renderable) {
    this.context.save();
    this.context.translate(renderable.x, renderable.y);
    this.context.rotate(renderable.angle);
    this.context.drawImage(
      renderable.image,
      renderable.width * -0.5,
      renderable.height * -0.5,
      renderable.width,
      renderable.height
    );
    this.context.restore();
  }.bind(this));
};

