var PointersSystem = function (game) {
  this.game = game;
  this.pointers = [];
  this.enablePointers();
};

PointersSystem.prototype.add = function () {
  var pointer = new naive.Pointer(this.pointers.length + 1);
  this.pointers.unshift(pointer);
  return pointer;
};

PointersSystem.prototype.enablePointers = function () {
  this.game.canvas.canvas.style.touchAction = 'none';
  this.game.canvas.canvas.addEventListener('pointerdown', this.handlePointerDown.bind(this), false);
  this.game.canvas.canvas.addEventListener('pointermove', this.handlePointerMove.bind(this), false);
  this.game.canvas.canvas.addEventListener('pointerup', this.handlePointerUpAndCancel.bind(this), false);
  this.game.canvas.canvas.addEventListener('pointercancel', this.handlePointerUpAndCancel.bind(this), false);
  this.game.canvas.canvas.addEventListener('pointerleave', this.handlePointerUpAndCancel.bind(this), false);
};

PointersSystem.prototype.getPointerByID = function (id) {
  var output = false;
  this.pointers.forEach(function (pointer) {
    if (pointer.id === id) {
      output = pointer;
    }
  });
  return output;
};

PointersSystem.prototype.getInactivePointer = function () {
  var output = false;
  this.pointers.forEach(function (pointer) {
    if (pointer.active === false) {
      output = pointer;
    }
  });
  return output;
};

PointersSystem.prototype.handlePointerDown = function (event) {
  event.preventDefault();
  var pointer = this.getPointerByID(event.pointerId) || this.getInactivePointer();
  pointer.active = true;
  pointer.id = event.pointerId;
  pointer.hold = true;
  pointer.startX = event.clientX - event.target.offsetLeft;
  pointer.startY = event.clientY - event.target.offsetTop;
  pointer.x = event.clientX - event.target.offsetLeft;
  pointer.y = event.clientY - event.target.offsetTop;
};

PointersSystem.prototype.handlePointerMove = function (event) {
  event.preventDefault();
  var pointer = this.getPointerByID(event.pointerId) || this.getInactivePointer();
  pointer.active = true;
  pointer.id = event.pointerId;
  pointer.x = event.clientX - event.target.offsetLeft;
  pointer.y = event.clientY - event.target.offsetTop;
};

PointersSystem.prototype.handlePointerUpAndCancel = function (event) {
  event.preventDefault();
  var pointer = this.getPointerByID(event.pointerId);
  pointer.active = false;
  pointer.hold = false;
  pointer.startX = 0;
  pointer.startY = 0;
};

PointersSystem.prototype.update = function (delta, frame) {
  this.pointers.forEach(function (pointer) {
    if (pointer.hold) {
      pointer.holdTime += delta;
      pointer.endFrame = 0;
      if (pointer.startFrame === 0) {
        pointer.startFrame = frame;
      }
    } else {
      pointer.holdTime = 0;
      pointer.startFrame = 0;
      if (pointer.endFrame === 0) {
        pointer.endFrame = frame;
      }
    }
    pointer.start = (pointer.startFrame === frame);
    pointer.end = (pointer.endFrame === frame);
  }.bind(this));
};
