cherry.Pool = function (cls, reset) {
  this.cls = cls;
  this.pool = [];
  this.reset = reset;
  this.size = 0;
  this.used = 0;
};

cherry.Pool.prototype.clear = function () {
  this.pool = [];
  this.used = 0;
  this.size = 0;
};

cherry.Pool.prototype.dismiss = function (obj) {
  this.pool.forEach(function (item) {
    if (item.object === obj) {
      item.active = false;
    }
  });
  this.used--;
};

cherry.Pool.prototype.each = function (fn) {
  var length = this.pool.length;
  var i;
  for (i = 0; i < length; i++) {
    if (this.pool[i].active === true) {
      fn(this.pool[i].object, i);
    }
  }
};

cherry.Pool.prototype.use = function () {

  // get a free object
  var unusedItem = false;
  this.pool.forEach(function (item) {
    if (item.active === false) {
      unusedItem = item;
    }
  });

  // if free object init and reuse it
  if (unusedItem) {
    var args = Array.prototype.slice.call(arguments);
    this.reset.apply(this.reset, args);
    unusedItem.active = true;
    this.used++;
    return unusedItem.object;
  }

  // if no free object creates one
  var item = {
    active: true,
    object: new (Function.prototype.bind.apply(this.cls, [null].concat(Array.prototype.slice.call(arguments))))()
  };
  this.pool.push(item);
  this.used++;
  this.size++;
  return item.object;
};
