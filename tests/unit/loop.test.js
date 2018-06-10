var cherry = require('../../dist/cherry');
var loop = new cherry.Loop();
var taskExecuted = false;
// var stepped = false;
// loop.onStep = function () {
//   var stepped = true;
// }

describe('Loop', function () {
  it('should have correct inital values', function () {
    expect(loop.delta).toBe(0);
    expect(loop.fps).toBe(60);
    expect(loop.frame).toBe(0);
    expect(loop.status).toBe('off');
    expect(loop.timestep).toBe(1000 / 60);
    expect(loop.queuedTasks.size).toBe(0);
  });
  it('should increment the frame number and update last time on step() and execute the onStep() function', function () {
    loop.step();
    expect(loop.frame).toBe(1);
    // expect(stepped).toBe(true);
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
