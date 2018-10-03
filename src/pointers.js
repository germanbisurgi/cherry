var Pointers = function () {
  this.pointers = [];
};

Pointers.prototype.add = function () {
  var pointer = {
    number: this.pointers.length + 1,
    active: false,
    isHolded: false,
    isDown: false,
    isUp: false,
    holdTime: 0,
    pressFrame: 0,
    releaseFrame: 0,
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
  pointer.isHolded = true;
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
  pointer.isHolded = false;
  pointer.startX = 0;
  pointer.startY = 0;
};

Pointers.prototype.updatePointers = function () {
  this.pointers.forEach(function (pointer) {
    if (pointer.isHolded) {
      pointer.holdTime += game.loop.delta;
      pointer.releaseFrame = 0;
      if (pointer.pressFrame === 0) {
        pointer.pressFrame = game.loop.frame;
      }
    } else {
      pointer.holdTime = 0;
      pointer.pressFrame = 0;
      if (pointer.releaseFrame === 0) {
        pointer.releaseFrame = game.loop.frame;
      }
    }
    pointer.isDown = (pointer.pressFrame === game.loop.frame);
    pointer.isUp = (pointer.releaseFrame === game.loop.frame);

  }.bind(this));
};

Pointers.prototype.update = function () {
  this.updatePointers();
};
