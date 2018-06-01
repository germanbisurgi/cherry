var ObjectPool = require('../../src/object-pool');

var pointA;
var pointB;
var pointC;

var objects = [];

var Point = function Point (x, y) {
  this.x = x;
  this.y = y;
};

var points = new ObjectPool({
  class: Point,
  reset: function (object, x, y) {
    object.x = x;
    object.y = y;
  }
});

describe('Points pool', function () {
  it('should have size = 0 and used = 0', function () {
    expect(points.size()).toBe(0);
    expect(points.used).toBe(0);
  });
  it('should allocate 3 object, have size = 3 and used = 3', function () {
    pointA = points.use(10, 10);
    pointB = points.use(10, 10);
    pointC = points.use(10, 10);
    expect(points.size()).toBe(3);
    expect(points.used).toBe(3);
  });
  it('should dismiss one object have size = 3 and used = 2', function () {
    points.dismiss(pointA);
    expect(points.size()).toBe(3);
    expect(points.used).toBe(2);
  });
  it('should iterate trhogh active items', function () {
    points.each(function (point) {
      objects.push(point);
    });
    expect(points.size()).toBe(3);
    expect(objects.length).toBe(2);
    expect(objects[0].x).toBe(10);
    expect(objects[0].y).toBe(10);
  });
  it('should clear', function () {
    points.clear();
    expect(points.size()).toBe(0);
    expect(points.used).toBe(0);
  });
});
