var Debug = function (context) {
  this.context = context;
  this.fontSize = 15;
  this.line = 1;
};

Debug.prototype.print = function (x, y, lines) {
  this.context.save();
  this.context.font = this.fontSize + 'px monospace';
  this.context.textAlign = 'start';
  for (var prop in lines) {
    if (lines.hasOwnProperty(prop)) {
      this.context.fillText(lines[prop], x, y + (this.line * this.fontSize));
      this.line++;
    }
  }
  this.context.restore();
  this.line = 1;
};
