var cherry = require('../../dist/cherry');
var state = new cherry.state('menu');

describe('State', function () {
  it('should have correct inital values', function () {
    expect(state.getName()).toBe('menu');
    expect(state.preloaded).toBe(false);
    expect(state.created).toBe(false);
  });
  it('should functional public setters and getters', function () {
    expect(state.getName()).toBe('menu');
  });
});
