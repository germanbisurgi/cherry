var naive = require('../../dist/naive');
var loop = new naive.Loop();
var taskExecuted = false;
var stepped = false;
loop.onStep = function () {
  stepped = true;
};

describe('Loop', function () {
  it('should have correct inital values', function () {
    expect(loop.delta).toBe(0);
    expect(loop.fps).toBe(60);
    expect(loop.frame).toBe(0);
    expect(loop.paused).toBe(true);
    expect(loop.timestep).toBe(1000 / 60);
  });
  it('should increment the frame number and update last time on step() and execute the onStep() function', function () {
    loop.step();
    expect(loop.frame).toBe(1);
    expect(stepped).toBe(true);
  });
  it('should stop execution', function () {
    loop.stop();
    expect(loop.paused).toBe(true);
  });
});
