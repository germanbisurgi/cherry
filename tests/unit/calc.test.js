var naive = require('../../dist/naive');
var calc = new naive.Calc();

describe('Calc', function () {
  it('should calculate norm', function () {
    expect(calc.norm(0, 0, 10)).toBe(0);
    expect(calc.norm(5, 0, 10)).toBe(0.5);
    expect(calc.norm(10, 0, 10)).toBe(1);
    expect(calc.norm(20, 0, 10)).toBe(2);
    expect(calc.norm(0, -10, 10)).toBe(0.5);
  });
  it('should calculate lerp', function () {
    expect(calc.lerp(0, 0, 10)).toBe(0);
    expect(calc.lerp(0.5, 0, 10)).toBe(5);
    expect(calc.lerp(1, 0, 10)).toBe(10);
    expect(calc.lerp(2, 0, 10)).toBe(20);
    expect(calc.lerp(0.5, -10, 10)).toBe(0);
  });
  it('should map values', function () {
    expect(calc.map(0, 0, 100, 0, 200)).toBe(0);
    expect(calc.map(5, 0, 100, 0, 200)).toBe(10);
    expect(calc.map(100, 0, 100, 0, 200)).toBe(200);
    expect(calc.map(200, 0, 100, 0, 200)).toBe(400);
    expect(calc.map(0, 0, 100, 0, 360)).toBe(0);
    expect(calc.map(50, 0, 100, 0, 360)).toBe(180);
    expect(calc.map(100, 0, 100, 0, 360)).toBe(360);
  });
  it('should clamp values in a range', function () {
    expect(calc.clamp(50, 0, 100)).toBe(50);
    expect(calc.clamp(-50, 0, 100)).toBe(0);
    expect(calc.clamp(150, 0, 100)).toBe(100);
  });
  it('should calculate distance', function () {
    expect(calc.distance({x: 0, y: 0}, {x: 10, y: 0})).toBe(10);
    expect(calc.distance({x: 0, y: 0}, {x: 0, y: 10})).toBe(10);
    expect(calc.distance({x: 0, y: 0}, {x: 10, y: 10})).toBe(14.142135623730951);
  });
  it('should output random numbers in a range', function () {
    expect(calc.randomRange(0, 1)).toBeGreaterThanOrEqual(0);
    expect(calc.randomRange(0, 1)).toBeLessThanOrEqual(1);
    expect(calc.randomRange(-1, 1)).toBeGreaterThanOrEqual(-1);
    expect(calc.randomRange(-1, 1)).toBeLessThanOrEqual(1);
  });
  it('should output random integers in a range', function () {
    var ints = [-1, 0, 1];
    var calcRandomInt = function () {
      var ri = calc.randomInt(-1, 1);
      return ints.indexOf(ri);
    };
    expect(calcRandomInt()).toBeGreaterThan(-1);
    expect(calcRandomInt()).toBeGreaterThan(-1);
    expect(calcRandomInt()).toBeGreaterThan(-1);
    expect(calcRandomInt()).toBeGreaterThan(-1);
    expect(calcRandomInt()).toBeGreaterThan(-1);
    expect(calcRandomInt()).toBeGreaterThan(-1);
  });
  it('should convert degrees to radians', function () {
    expect(calc.degreesToRadians(0)).toBe(0);
    expect(calc.degreesToRadians(90)).toBe(1.5707963267948966);
    expect(calc.degreesToRadians(180)).toBe(3.141592653589793);
    expect(calc.degreesToRadians(270)).toBe(4.71238898038469);
    expect(calc.degreesToRadians(360)).toBe(6.283185307179586);
  });
  it('should convert radians to degrees', function () {
    expect(calc.radiansToDegrees(0)).toBe(0);
    expect(calc.radiansToDegrees(1.5707963267948966)).toBe(90);
    expect(calc.radiansToDegrees(3.141592653589793)).toBe(180);
    expect(calc.radiansToDegrees(4.71238898038469)).toBe(270);
    expect(calc.radiansToDegrees(6.283185307179586)).toBe(360);
  });
  it('should calculate the angle between two points', function () {
    var a;
    var b;
    a = {x: 0, y: 0};

    b = {x: 1, y: 0};
    expect(calc.angleBetweenPoints(a, b)).toBe(0);
    b = {x: 0, y: 1};
    expect(calc.angleBetweenPoints(a, b)).toBe(1.5707963267948966);
    b = {x: -1, y: 0};
    expect(calc.angleBetweenPoints(a, b)).toBe(3.141592653589793);
    b = {x: 0, y: -1};
    expect(calc.angleBetweenPoints(a, b)).toBe(4.71238898038469);
  });

  it('should calculate a point given another point an angle and a radius', function () {
    var point = {x: 0, y: 0};
    expect(calc.angleToPoint(point, 0, 1)).toEqual({x: 1, y: 0});
    expect(calc.angleToPoint(point, 1.5707963267948966, 1)).toEqual({x: 6.123233995736766e-17, y: 1});
    expect(calc.angleToPoint(point, 3.141592653589793, 1)).toEqual({x: -1, y: 1.2246467991473532e-16});
    expect(calc.angleToPoint(point, 4.71238898038469, 1)).toEqual({x: -1.8369701987210297e-16, y: -1});
    expect(calc.angleToPoint(point, 6.283185307179586, 1)).toEqual({x: 1, y: -2.4492935982947064e-16});
  });
});
