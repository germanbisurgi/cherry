Camera = function () {
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;
  this.zoom = 1;
  this.angle = 0;
  this.lerp = 0.1;
};

Camera.prototype.follow = function (point) {
  // this.x += (this.zoom * point.x - (window.innerWidth / 2) - this.x) * this.lerp;
  // this.y += (this.zoom * point.y - (window.innerHeight / 2) - this.y) * this.lerp;
  this.x = point.x;
  this.y = point.y;
};
