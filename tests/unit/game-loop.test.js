var GameLoop = require('../../src/game-loop');
var gameLoop = new GameLoop();
var taskExecuted = false;

describe('Ensure that the game loop work properly', function () {
  it('it should have fps = 60', function () {
    expect(gameLoop.fps).toBe(60);
  });
  it('it should increment the frame number on tick()', function () {
    gameLoop.tick();
    expect(gameLoop.frame).toBe(1);
  });
  it('it should execute a queued task at the right frame', function () {
    gameLoop.queueTask(0, function () {
      taskExecuted = true;
    });
    gameLoop.tick();
    expect(taskExecuted).toBe(true);
  });
});
