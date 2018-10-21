var Pointers = function () {
  this.pointers = [];
};

Pointers.prototype.add = function () {
  var pointer = {
    number: this.pointers.length + 1,
    active: false,
    hold: false,
    start: false,
    end: false,
    holdTime: 0,
    startFrame: 0,
    endFrame: 0,
    id: 0,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0
  };
  this.pointers.unshift(pointer);
  return pointer;
};

Pointers.prototype.enablePointers = function (element) {
  element.style.touchAction = 'none';
  element.addEventListener('pointerdown', this.handlePointerDown.bind(this), false);
  element.addEventListener('pointermove', this.handlePointerMove.bind(this), false);
  element.addEventListener('pointerup', this.handlePointerUpAndCancel.bind(this), false);
  element.addEventListener('pointercancel', this.handlePointerUpAndCancel.bind(this), false);
  element.addEventListener('pointerleave', this.handlePointerUpAndCancel.bind(this), false);
};

Pointers.prototype.getPointerByID = function (id) {
  var output = false;
  this.pointers.forEach(function (pointer) {
    if (pointer.id === id) {
      output = pointer;
    }
  });
  return output;
};

Pointers.prototype.getInactivePointer = function () {
  var output = false;
  this.pointers.forEach(function (pointer) {
    if (pointer.active === false) {
      output = pointer;
    }
  });
  return output;
};

Pointers.prototype.handlePointerDown = function (event) {
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

Pointers.prototype.handlePointerMove = function (event) {
  event.preventDefault();
  var pointer = this.getPointerByID(event.pointerId) || this.getInactivePointer();
  pointer.active = true;
  pointer.id = event.pointerId;
  pointer.x = event.clientX - event.target.offsetLeft;
  pointer.y = event.clientY - event.target.offsetTop;
};

Pointers.prototype.handlePointerUpAndCancel = function (event) {
  event.preventDefault();
  var pointer = this.getPointerByID(event.pointerId);
  pointer.active = false;
  pointer.hold = false;
  pointer.startX = 0;
  pointer.startY = 0;
};

Pointers.prototype.update = function (delta, frame) {
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
