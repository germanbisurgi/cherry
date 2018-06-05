var cherry = require('../../dist/cherry');
var signal = new cherry.signal();

describe('Signal', function () {
  it('should have correct inital values', function () {
    expect(signal.getTest()).toBe(null);
  });
  it('should functional public setters and getters', function () {
    expect(signal.getTest()).toBe(null);
  });
});
