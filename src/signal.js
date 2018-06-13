cherry.Signal = function (context) {

  this.enabled = true;

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
  if (this.has(fn)) {
    return false;
  } else {
    this.listeners.use(fn, false);
  }
};

cherry.Signal.prototype.addOnce = function (fn) {
  if (this.has(fn)) {
    return false;
  } else {
    this.listeners.use(fn, true);
  }
};

cherry.Signal.prototype.dispatch = function () {
  if (this.enabled === true) {
    var args = Array.prototype.slice.call(arguments);
    this.listeners.each(function (listener) {
      listener.execute.apply(listener, args);
      if (listener.once === true) {
        this.listeners.dismiss(listener);
      }
    }.bind(this));
  }
};

cherry.Signal.prototype.has = function (listener) {
  var output = false;
  this.listeners.each(function (activeListener) {
    if (activeListener.execute === listener) {
      output = true;
    }
  });
  return output;
};

cherry.Signal.prototype.remove = function (listener) {
  this.listeners.each(function (activeListener) {
    if (activeListener.execute === listener) {
      this.listeners.dismiss(activeListener);
    }
  }.bind(this));
};

cherry.Signal.prototype.removeAll = function () {
  this.listeners.clear();
};
