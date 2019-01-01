var Canvas = function (container) {
  this.element = document.createElement('canvas');
  this.context = this.element.getContext('2d');

  if (container) {
    this.container = document.querySelector(container);
    this.container.appendChild(this.element);
  }

  this.resize();
  window.addEventListener('resize', this.resize.bind(this));
};

Canvas.prototype.resize = function () {
  this.element.width = window.innerWidth;
  this.element.height = window.innerHeight;
};

Canvas.prototype.circle = function (x, y, radius) {
  this.context.beginPath();
  this.context.arc(x, y, radius, 0, 2 * Math.PI);
  this.context.stroke();
};

Canvas.prototype.clear = function () {
  this.context.clearRect(0, 0, this.element.width, this.element.height);
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
  this.context.font = '14px monospace';
  this.context.fillStyle = 'white';
  this.context.fillText(text, x, y);
};

Canvas.prototype.grid = function (x, y, width, height, cols, rows) {
  this.context.save();
  this.context.strokeStyle = 'white';
  this.context.textAlign = 'center';
  this.context.textBaseline = 'middle';
  for (var ry = 0; ry < rows; ry++) {
    for (var rx = 0; rx < cols; rx++) {
      this.rect(rx * width, ry * height, width, height);
      this.text(rx * width + width / 2, ry * height + height / 2, rx + ',' + ry);
    }
  }
  this.context.restore();
};
