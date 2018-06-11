cherry.Signal = function (context) {

  var Listener = function (fn) {
    this.execute = fn
  };

  this.listeners = new cherry.Pool(Listener, function (object, fn) {
    object.execute = fn;
  });

};

cherry.Signal.prototype.add = function (fn) {
  this.listeners.use(fn);
};

cherry.Signal.prototype.dispatch = function () {
  var args = Array.prototype.slice.call(arguments);
  this.listeners.each(function (listener) {
    listener.execute.apply(listener, args);
  });
};

cherry.Signal.prototype.remove = function (listener) {
  this.listeners.dismiss(listener);
};