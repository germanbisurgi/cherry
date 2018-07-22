var Pointers = function (game) {
  this.tracked = {};
  window.addEventListener('pointerdown', this.handleStart.bind(this), false);
  window.addEventListener('pointerup', this.handleEnd.bind(this), false);
  window.addEventListener('pointercancel', this.handleCancel.bind(this), false);
  window.addEventListener('pointermove', this.handleMove.bind(this), false);
};

Pointers.prototype.handleStart = function (event) {
  this.processEvent(event);
};

Pointers.prototype.handleEnd = function (event) {
  this.processEvent(event);
};

Pointers.prototype.handleCancel = function (event) {
  this.processEvent(event);
};

Pointers.prototype.handleMove = function (event) {
  this.processEvent(event);
};

Pointers.prototype.processEvent = function (event) {
  event.preventDefault();
  this.tracked[event.pointerId] = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY
  };
};
