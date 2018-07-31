var Pointers = function (game) {

  this.tracked = [];

  for (var i = 10 - 1; i >= 0; i--) {
    this.tracked.push({active: false, number: i, id: 0, x: 100, y: 100});
  }

};

Pointers.prototype.enable = function (element) {
  element.style.touchAction = 'none';
  element.addEventListener('pointerdown', this.track.bind(this), false);
  element.addEventListener('pointermove', this.track.bind(this), false);
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

Pointers.prototype.track = function (event) {
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
};
