var Signal = function (context) {

  this.enabled = true;

  var Listener = function (fn, once, prio) {
    this.execute = fn;
    this.once = once || false;
    this.prio = prio || 0;
  };

  this.listeners = new naive.Pool(Listener, function (object, fn, once, prio) {
    object.execute = fn;
    object.once = once || false;
    object.prio = prio || 0;
  });

};

Signal.prototype.add = function (fn, prio) {
  if (this.has(fn)) {
    return false;
  } else {
    this.listeners.use(fn, false, prio);
    this.listeners.pool.sort(function (a, b) {
      return (b.object.prio - a.object.prio);
    });
  }
};

Signal.prototype.addOnce = function (fn, prio) {
  if (this.has(fn)) {
    return false;
  } else {
    this.listeners.use(fn, true, prio);
    this.listeners.pool.sort(function (a, b) {
      return (b.object.prio - a.object.prio);
    });
  }
};

Signal.prototype.dispatch = function () {
  if (this.enabled === false) {
    return;
  }

  var args = Array.prototype.slice.call(arguments);

  this.listeners.each(function (listener) {
    listener.execute.apply(listener, args);
    if (listener.once === true) {
      this.listeners.dismiss(listener);
    }
  }.bind(this));
};

Signal.prototype.has = function (listener) {
  var output = false;
  this.listeners.each(function (activeListener) {
    if (activeListener.execute === listener) {
      output = true;
    }
  });
  return output;
};

Signal.prototype.remove = function (listener) {
  this.listeners.each(function (activeListener) {
    if (activeListener.execute === listener) {
      this.listeners.dismiss(activeListener);
    }
  }.bind(this));
};

Signal.prototype.removeAll = function () {
  this.listeners.clear();
};
