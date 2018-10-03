var Grid = function (x, y, width, height, cols, rows) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.cols = cols;
  this.rows = rows;
  this.colWidth = this.width / this.cols;
  this.rowHeight = this.height / this.rows;
};

Grid.prototype.draw = function (render) {
  var i = 1;
  render.rect(this.x, this.y, this.width, this.height);
  for (i = 1; i < this.cols; i++) {
    render.line(
      this.x + this.colWidth * i,
      this.y,
      this.x + this.colWidth * i,
      this.height + this.y
    );
  }
  for (i = 1; i < this.rows; i++) {
    render.line(
      this.x,
      this.y + this.rowHeight * i,
      this.width + this.x,
      this.y + this.rowHeight * i
    );
  }
};
