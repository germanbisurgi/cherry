var cherry = require('../../dist/cherry');
var context = {}; // mocks a canvas context object
var debug = new cherry.Debug(context);

describe('Debug', function () {
  it('should have correct inital values', function () {
    expect(typeof debug.context).toBe('object');
    expect(debug.fontSize).toBe(15);
    expect(debug.line).toBe(1);
  });
});
