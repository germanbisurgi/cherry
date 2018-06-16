var naive = require('../../dist/naive');
var game = new naive.Game();
var state = new naive.State('menu');
var stateManager = game.state;

describe('StateManager', function () {
  it('should have correct inital values', function () {
    expect(stateManager.current).toBe(null);
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
    expect(game.loop.frame).toBe(0);
    stateManager.switch('menu');
    expect(stateManager.current).toBe(null);
    game.loop.step();
    expect(game.loop.frame).toBe(1);
    expect(stateManager.current.name).toBe('menu');
  });
});
