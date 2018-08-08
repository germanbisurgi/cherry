var Pointers = function (game) {
  this.tracked = [];
};

Pointers.prototype.add = function () {
  var pointer = {
    number: this.tracked.length + 1,
    active: false,
    isHolded: false,
    isDown: false,
    isUp: false,
    holdTime: 0,
    pressFrame: 0,
    releaseFrame: 0,
    id: 0,
    x: 100,
    y: 100
  };
  this.tracked.unshift(pointer);
  return pointer;
};

Pointers.prototype.enable = function (element) {
  element.style.touchAction = 'none';
  element.addEventListener('pointerdown', this.trackPointerDown.bind(this), false);
  element.addEventListener('pointermove', this.trackPointerMove.bind(this), false);
  element.addEventListener('pointerup', this.untrack.bind(this), false);
  element.addEventListener('pointercancel', this.untrack.bind(this), false);
};

Pointers.prototype.getByID = function (id) {
  var output = false;
  this.tracked.forEach(function (pointer) {
    if (pointer.id === id) {
      output = pointer;
    }
  });
  return output;
};

Pointers.prototype.getInactivePointer = function () {
  var output = false;
  this.tracked.forEach(function (pointer) {
    if (pointer.active === false) {
      output = pointer;
    }
  });
  return output;
};

Pointers.prototype.trackPointerDown = function (event) {
  event.preventDefault();
  var pointer = this.getByID(event.pointerId) || this.getInactivePointer();
  pointer.active = true;
  pointer.id = event.pointerId;
  pointer.isHolded = true;
  pointer.x = event.clientX - event.target.offsetLeft;
  pointer.y = event.clientY - event.target.offsetTop;
};

Pointers.prototype.trackPointerMove = function (event) {
  event.preventDefault();
  var pointer = this.getByID(event.pointerId) || this.getInactivePointer();
  pointer.active = true;
  pointer.id = event.pointerId;
  pointer.x = event.clientX - event.target.offsetLeft;
  pointer.y = event.clientY - event.target.offsetTop;
};

Pointers.prototype.untrack = function (event) {
  event.preventDefault();
  var pointer = this.getByID(event.pointerId);
  pointer.active = false;
  pointer.isHolded = false;
};

Pointers.prototype.update = function (event) {
  this.tracked.forEach(function (pointer) {

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
