var Pointers = function (game) {
  this.tracked = {};
};

Pointers.prototype.enable = function (element) {
  element.style.touchAction = 'none';
  element.addEventListener('pointerdown', this.handleStart.bind(this), false);
  element.addEventListener('pointerup', this.handleEnd.bind(this), false);
  element.addEventListener('pointercancel', this.handleCancel.bind(this), false);
  element.addEventListener('pointermove', this.handleMove.bind(this), false);
};

Pointers.prototype.handleStart = function (event) {
  event.preventDefault();
  this.tracked[event.pointerId] = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY
  };
};

Pointers.prototype.handleEnd = function (event) {
  event.preventDefault();
  delete this.tracked[event.pointerId];
};

Pointers.prototype.handleCancel = function (event) {
  event.preventDefault();
  delete this.tracked[event.pointerId];
};

Pointers.prototype.handleMove = function (event) {
  event.preventDefault();
  if (typeof this.tracked[event.pointerId] !== 'undefined') {
    this.tracked[event.pointerId].x = event.clientX,
    this.tracked[event.pointerId].y = event.clientY;
  } else {
    this.tracked[event.pointerId] = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY
    };
  }
};
