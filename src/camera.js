Camera = function () {
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;
  this.zoom = 1;
  this.angle = 0;
  this.lerp = 0.1;

  this.resize();

  window.addEventListener('resize', this.resize.bind(this));
};

Camera.prototype.follow = function (point) {
  // this.x += (this.zoom * point.x - (window.innerWidth / 2) - this.x) * this.lerp;
  // this.y += (this.zoom * point.y - (window.innerHeight / 2) - this.y) * this.lerp;
  this.x = point.x - this.width / 2;
  this.y = point.y - this.height / 2;
};

Camera.prototype.resize = function () {
  this.width = window.innerWidth;
  this.height = window.innerHeight;
};

Camera.prototype.getPosition = function () {
  return {
    x: this.x,
    y: this.y
  };
};

Camera.prototype.getCenter = function () {
  return {
    x: this.x + this.width / 2,
    y: this.y + this.height / 2
  };
};
