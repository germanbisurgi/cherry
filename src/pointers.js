var Pointers = function (game) {

  var self = this;

  var Pointer = function (event) {
    this.number = self.tracked.used;
    this.id = event.pointerId;
    this.x = event.clientX - event.target.offsetLeft;
    this.y = event.clientY - event.target.offsetTop;
  };

  this.tracked = new naive.Pool(Pointer, function (object, event) {
    object.number = self.tracked.used;
    object.id = event.pointerId;
    object.x = event.clientX - event.target.offsetLeft;
    object.y = event.clientY - event.target.offsetTop;
  });
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
  this.tracked.each(function (pointer) {
    if (pointer.id === id) {
      output = pointer;
    }
  });
  return output;
};

Pointers.prototype.track = function (event) {
  event.preventDefault();
  var pointer = this.getByID(event.pointerId);
  if (pointer) {
    pointer.x = event.clientX - event.target.offsetLeft;
    pointer.y = event.clientY - event.target.offsetTop;
  } else {
    this.tracked.use(event);
  }
};

Pointers.prototype.untrack = function (event) {
  event.preventDefault();
  var pointer = this.getByID(event.pointerId);
  this.tracked.dismiss(pointer);
};
