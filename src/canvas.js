var Canvas = function (container) {
  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  if (typeof container !== 'undefined') {
    this.container = document.querySelector('.container');
    if (this.container) {
      this.container.appendChild(this.canvas);
    }
  }
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
  this.canvas.style = 'border: 1px solid pink;';
};

Canvas.prototype.circle = function (x, y, radius) {
  this.context.beginPath();
  this.context.arc(x, y, radius, 0, 2 * Math.PI);
  this.context.stroke();
};

Canvas.prototype.clear = function () {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Canvas.prototype.image = function (image, x, y, w, h) {
  this.context.drawImage(image, 0, 0, image.width, image.height, x - w / 2, y - h / 2, w, h);
};

Canvas.prototype.line = function (ax, ay, bx, by) {
  this.context.beginPath();
  this.context.moveTo(ax, ay);
  this.context.lineTo(bx, by);
  this.context.stroke();
};

Canvas.prototype.rect = function (x, y, w, h) {
  this.context.rect(x, y, w, h);
  this.context.stroke();
};

Canvas.prototype.text = function (x, y, text) {
  this.context.font = '16px monospace';
  this.context.fillText(text, x, y);
};
