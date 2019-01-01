var Renderable = function (image, width, height, offsetX, offsetY) {
  this.image = image;
  this.width = width;
  this.height = height;
  this.offsetX = offsetX || 0;
  this.offsetY = offsetY || 0;
  this.x = 0;
  this.y = 0;
  this.angle = 0;
};
