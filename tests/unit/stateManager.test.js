var cherry = require('../../dist/cherry');
var game = new cherry.game();
var state = new cherry.State('menu');
var stateManager = game.states;

describe('StateManager', function () {
  it('should have correct inital values', function () {
    expect(stateManager.getCurrent()).toBe(null);
    expect(stateManager.getStates().length).toBe(0);
  });
  it('should functional public setters and getters', function () {
    expect(stateManager.getCurrent()).toBe(null);
    expect(stateManager.getStates().length).toBe(0);
  });
  it('should add a state', function () {
    stateManager.add(state);
    expect(stateManager.getCurrent()).toBe(null);
    expect(stateManager.getStates().length).toBe(1);
  });
  it('should get a state by name', function () {
    expect(stateManager.getByName('menu').name).toBe('menu');
  });
  it('should switch a state by name in the next step', function () {
    expect(game.loop.getFrame()).toBe(0);
    stateManager.switch('menu');
    expect(stateManager.getCurrent()).toBe(null);
    game.loop.step();
    expect(game.loop.getFrame()).toBe(1);
    expect(stateManager.getCurrent().name).toBe('menu');
  });
});
