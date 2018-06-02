var comp = require('../../dist/comp');
var render = new comp.render();
var canvas = 0;
var context;

describe('Render', function () {
  it('should create a canvas with correct size', function () {
    expect(canvas).toBe(0);
  });
});
