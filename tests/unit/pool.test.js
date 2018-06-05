var cherry = require('../../dist/cherry');
var pointA;
var pointB;
var pointC;
var objects = [];

var Point = function Point (x, y) {
  this.x = x;
  this.y = y;
};

var pool = new cherry.pool({
  class: Point,
  reset: function (object, x, y) {
    object.x = x;
    object.y = y;
  }
});

describe('Pool', function () {
  it('should have correct inital values', function () {
    expect(pool.getSize()).toBe(0);
    expect(pool.getUsed()).toBe(0);
  });
  it('should functional public setters and getters', function () {
    expect(pool.getSize()).toBe(0);
    expect(pool.getUsed()).toBe(0);
  });
  it('should allocate 3 object, have size = 3 and used = 3', function () {
    pointA = pool.use(10, 10);
    pointB = pool.use(10, 10);
    pointC = pool.use(10, 10);
    expect(pool.getSize()).toBe(3);
    expect(pool.getUsed()).toBe(3);
  });
  it('should dismiss one object have size = 3 and used = 2', function () {
    pool.dismiss(pointA);
    expect(pool.getSize()).toBe(3);
    expect(pool.getUsed()).toBe(2);
  });
  it('should iterate trhogh active items', function () {
    pool.each(function (point) {
      objects.push(point);
    });
    expect(pool.getSize()).toBe(3);
    expect(objects.length).toBe(2);
    expect(objects[0].x).toBe(10);
    expect(objects[0].y).toBe(10);
  });
  it('should clear', function () {
    pool.clear();
    expect(pool.getSize()).toBe(0);
    expect(pool.getUsed()).toBe(0);
  });
});
