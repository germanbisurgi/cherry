var comp = require('../../dist/comp');
var loop = new comp.loop();
var taskExecuted = false;

describe('Loop', function () {
  it('should correct inital  values', function () {
    expect(loop.getDelta()).toBe(0);
    expect(loop.getFps()).toBe(60);
    expect(loop.getFrame()).toBe(0);
    expect(loop.getStatus()).toBe('off');
    expect(loop.getTasks().size()).toBe(0);
    expect(loop.getTimestep()).toBe(1000 / 60);
  });
  it('should functional public setters', function () {
    loop.setFps(30);
    loop.setStatus('on');
    expect(loop.getFps()).toBe(30);
    expect(loop.getTimestep()).toBe(1000 / 30);
    expect(loop.getStatus()).toBe('on');
  });
  it('should reset to initial values', function () {
    loop.reset();
    expect(loop.getDelta()).toBe(0);
    expect(loop.getFps()).toBe(60);
    expect(loop.getFrame()).toBe(0);
    expect(loop.getStatus()).toBe('off');
    expect(loop.getTasks().size()).toBe(0);
  });
  it('should increment the frame number and update last time on step() ', function () {
    loop.step();
    expect(loop.getFrame()).toBe(1);
    expect(loop.getFrame()).not.toBe(0);
  });
  it('should execute a queued task at the right frame', function () {
    loop.queueTask(0, function () {
      taskExecuted = true;
    });
    loop.step();
    expect(taskExecuted).toBe(true);
  });
});
