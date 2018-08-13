var Inputs = function () {
  this.keys = {};
  this.pointers = [];
  document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
  document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
};

// Keys.

Inputs.prototype.addKey = function (key) {
  this.keys[key] = {
    key: key,
    isDown: false,
    isUp: false,
    isHolded: false,
    holdTime: 0,
    pressFrame: 0,
    releaseFrame: 0
  };
  return this.keys[key];
};

Inputs.prototype.handleKeyDown = function (event) {
  event.preventDefault();
  if (typeof this.keys[event.key] !== 'undefined') {
    this.keys[event.key].isHolded = true;
  }
};

Inputs.prototype.handleKeyUp = function (event) {
  event.preventDefault();
  if (typeof this.keys[event.key] !== 'undefined') {
    this.keys[event.key].isHolded = false;
  }
};

Inputs.prototype.updateKeys = function () {
  for (var i in this.keys) {
    if (!this.keys.hasOwnProperty(i)) {
      continue;
    }
    if (this.keys[i].isHolded) {
      this.keys[i].holdTime += game.loop.delta;
      this.keys[i].releaseFrame = 0;
      if (this.keys[i].pressFrame === 0) {
        this.keys[i].pressFrame = game.loop.frame;
      }
    } else {
      this.keys[i].holdTime = 0;
      this.keys[i].pressFrame = 0;
      if (this.keys[i].releaseFrame === 0) {
        this.keys[i].releaseFrame = game.loop.frame;
      }
    }
    this.keys[i].isDown = (this.keys[i].pressFrame === game.loop.frame);
    this.keys[i].isUp = (this.keys[i].releaseFrame === game.loop.frame);
  }
};

// Pointers.

Inputs.prototype.addPointer = function () {
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
    x: 100,
    y: 100
  };
  this.pointers.unshift(pointer);
  return pointer;
};

Inputs.prototype.enablePointers = function (element) {
  element.style.touchAction = 'none';
  element.addEventListener('pointerdown', this.handlePointerDown.bind(this), false);
  element.addEventListener('pointermove', this.handlePointerMove.bind(this), false);
  element.addEventListener('pointerup', this.handlePointerUpAndCancel.bind(this), false);
  element.addEventListener('pointercancel', this.handlePointerUpAndCancel.bind(this), false);
};

Inputs.prototype.getPointerByID = function (id) {
  var output = false;
  this.pointers.forEach(function (pointer) {
    if (pointer.id === id) {
      output = pointer;
    }
  });
  return output;
};

Inputs.prototype.getInactivePointer = function () {
  var output = false;
  this.pointers.forEach(function (pointer) {
    if (pointer.active === false) {
      output = pointer;
    }
  });
  return output;
};

Inputs.prototype.handlePointerDown = function (event) {
  event.preventDefault();
  var pointer = this.getPointerByID(event.pointerId) || this.getInactivePointer();
  pointer.active = true;
  pointer.id = event.pointerId;
  pointer.isHolded = true;
  pointer.x = event.clientX - event.target.offsetLeft;
  pointer.y = event.clientY - event.target.offsetTop;
};

Inputs.prototype.handlePointerMove = function (event) {
  event.preventDefault();
  var pointer = this.getPointerByID(event.pointerId) || this.getInactivePointer();
  pointer.active = true;
  pointer.id = event.pointerId;
  pointer.x = event.clientX - event.target.offsetLeft;
  pointer.y = event.clientY - event.target.offsetTop;
};

Inputs.prototype.handlePointerUpAndCancel = function (event) {
  event.preventDefault();
  var pointer = this.getPointerByID(event.pointerId);
  pointer.active = false;
  pointer.isHolded = false;
};

Inputs.prototype.updatePointers = function (event) {
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
