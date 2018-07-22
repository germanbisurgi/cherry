var Canvas = function (container) {
  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  if (typeof container !== 'undefined') {
    this.container = document.querySelector(container);
    this.container.appendChild(this.canvas);
  }
  this.canvas.width = window.innerWidth * 0.9;
  this.canvas.height = window.innerHeight * 0.9;
  this.canvas.style = 'border: 1px solid pink;';
};

Canvas.prototype.clear = function () {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Canvas.prototype.image = function (image, x, y, w, h) {
  this.context.drawImage(image, 0, 0, image.width, image.height, x, y, w, h);
};

Canvas.prototype.text = function (x, y, text) {
  this.context.font = '16px monospace';
  this.context.fillText(text, x, y);
};
