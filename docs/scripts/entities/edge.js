var Edge = function (ax, ay, bx, by) {
  this.ax = ax || 0;
  this.ay = ay || 0;
  this.bx = bx || 0;
  this.by = by || 0;
  this.body = game.physics.addBody(this.ax, this.ay, 'static');
  this.body.addEdge(0, 0, this.bx - ax, this.by - ay);
};

Edge.prototype.draw = function (canvas) {
  canvas.line(this.ax, this.ay, this.bx, this.by);
};
