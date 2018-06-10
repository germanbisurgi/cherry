var cherry = require('../../dist/cherry');
var state = new cherry.State('menu');

describe('State', function () {
  it('should have correct inital values', function () {
    expect(state.name).toBe('menu');
    expect(state.preloaded).toBe(false);
    expect(state.created).toBe(false);
  });
});
