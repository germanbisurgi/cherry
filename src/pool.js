var Pool = function (cls, reset) {
  this.cls = cls;
  this.pool = [];
  this.reset = reset;
  this.size = 0;
  this.used = 0;
};

Pool.prototype.clear = function () {
  this.pool = [];
  this.used = 0;
  this.size = 0;
};

Pool.prototype.dismiss = function (obj) {
  this.pool.forEach(function (item) {
    if (item.object === obj) {
      item.active = false;
    }
  });
  this.used--;
};

Pool.prototype.each = function (fn) {
  var length = this.pool.length;
  var i;
  for (i = 0; i < length; i++) {
    if (this.pool[i].active === true) {
      fn(this.pool[i].object, i);
    }
  }
};

Pool.prototype.use = function () {
  var args = Array.prototype.slice.call(arguments);

  // get a free object
  var unusedItem = false;
  this.pool.forEach(function (item) {
    if (item.active === false) {
      unusedItem = item;
    }
  });

  // if free object init and reuse it
  if (unusedItem) {
    this.reset(unusedItem.object, ...args);
    unusedItem.active = true;
    this.used++;
    return unusedItem.object;
  }

  // if no free object creates one
  var item = {
    active: true,
    object: new this.cls(...args)
  };
  this.pool.push(item);
  this.used++;
  this.size++;
  return item.object;
};
