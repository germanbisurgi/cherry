var comp = require('../../dist/comp');
var game = new comp.game();
var state = new comp.state('menu');
var stateManager = game.states;

describe('State', function () {
  it('should have correct inital  values', function () {
    expect(stateManager.current).toBe(null);
    expect(stateManager.states.length).toBe(0);
  });
  it('should add a state', function () {
    stateManager.add(state);
    expect(stateManager.current).toBe(null);
    expect(stateManager.states.length).toBe(1);
  });
  it('should get a state by name', function () {
    expect(stateManager.get('menu').name).toBe('menu');
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
