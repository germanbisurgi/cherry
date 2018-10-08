var naive = require('../../dist/naive');
var state = new naive.State('menu');
var stateManager = new naive.StateManager();

describe('StateManager', function () {
  it('should have correct inital values', function () {
    expect(stateManager.current).toBe(null);
    expect(stateManager.requested).toBe(null);
    expect(stateManager.states.length).toBe(0);
  });
  it('should add a state', function () {
    stateManager.add(state);
    expect(stateManager.current).toBe(null);
    expect(stateManager.states.length).toBe(1);
  });
  it('should get a state by name', function () {
    expect(stateManager.getByName('menu').name).toBe('menu');
  });
  it('should switch a state by name in the next step', function () {
    stateManager.switch('menu');
    expect(stateManager.current).toBe(null);
    expect(stateManager.requested).toBe('menu');
    stateManager.update();
    expect(stateManager.current.name).toBe('menu');
    expect(stateManager.requested).toBe(null);
  });
});
