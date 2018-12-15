Camera = function () {
  this.position = {x: 0, y: 0};
  this.width = 0;
  this.height = 0;
  this.zoom = 1;
  this.angle = 0;
  this.lerp = 0.1;

  this.resize();

  window.addEventListener('resize', this.resize.bind(this));
};

Camera.prototype.follow = function (point) {
  // this.position.x += (this.zoom * point.x - (window.innerWidth / 2) - this.position.x) * this.lerp;
  // this.position.y += (this.zoom * point.y - (window.innerHeight / 2) - this.position.y) * this.lerp;
  this.position.x = point.x - this.width / 2;
  this.position.y = point.y - this.height / 2;
};

Camera.prototype.resize = function () {
  this.width = window.innerWidth;
  this.height = window.innerHeight;
};

Camera.prototype.getPosition = function () {
  return this.position;
};

Camera.prototype.getCenter = function () {
  return {
    x: this.position.x + this.width / 2,
    y: this.position.y + this.height / 2
  };
};

Camera.prototype.getViewCenter = function () {
  return {
    x: this.width / 2,
    y: this.height / 2
  };
};

