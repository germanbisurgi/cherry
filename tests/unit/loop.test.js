var cherry = require('../../dist/cherry');
var loop = new cherry.loop();
var taskExecuted = false;

describe('Loop', function () {
  it('should have correct inital values', function () {
    expect(loop.getDelta()).toBe(0);
    expect(loop.getFps()).toBe(60);
    expect(loop.getFrame()).toBe(0);
    expect(loop.getStatus()).toBe('off');
    expect(loop.getTimestep()).toBe(1000 / 60);
    expect(loop.queuedTasks.getSize()).toBe(0);
  });
  it('should functional public setters and getters', function () {
    loop.setFps(30);
    loop.setStatus('on');
    expect(loop.getDelta()).toBe(0);
    expect(loop.getFps()).toBe(30);
    expect(loop.getFrame()).toBe(0);
    expect(loop.getStatus()).toBe('on');
    expect(loop.getTimestep()).toBe(1000 / 30);
  });
  it('should increment the frame number and update last time on step() ', function () {
    loop.step();
    expect(loop.getFrame()).toBe(1);
    expect(loop.getFrame()).not.toBe(0);
  });
  it('should execute a queued task in the next step', function () {
    loop.nextStep(function () {
      taskExecuted = true;
    });
    expect(taskExecuted).toBe(false);
    loop.step();
    expect(taskExecuted).toBe(true);
  });
});
