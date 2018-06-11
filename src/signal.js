cherry.Signal = function (context) {

  var Listener = function (fn, once) {
    this.once = once || false;
    this.execute = fn;
  };

  this.listeners = new cherry.Pool(Listener, function (object, fn, once) {
    object.once = once || false;
    object.execute = fn;
  });

};

cherry.Signal.prototype.add = function (fn) {
  this.listeners.use(fn, false);
};

cherry.Signal.prototype.addOnce = function (fn) {
  this.listeners.use(fn, true);
};

cherry.Signal.prototype.dispatch = function () {
  var args = Array.prototype.slice.call(arguments);
  this.listeners.each(function (listener) {
    listener.execute.apply(listener, args);
    if (listener.once === true) {
      this.listeners.dismiss(listener);
    }
  }.bind(this));
};

cherry.Signal.prototype.remove = function (listener) {
  this.listeners.dismiss(listener);
};
