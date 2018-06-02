var comp = require('../../dist/comp');
var render = new comp.render();
var canvas;
var context;

describe('Render', function () {
  it('should create a canvas with correct size', function () {
    render.createCanvas();
    expect(points.size()).toBe(0);
    expect(points.used).toBe(0);
  });
});
