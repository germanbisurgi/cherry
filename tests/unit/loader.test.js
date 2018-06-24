var naive = require('../../dist/naive');
var loader = new naive.Loader();

describe('Loader', function () {
  it('should have correct inital values', function () {
    expect(loader.errors).toBe(0);
    expect(loader.success).toBe(0);
    expect(loader.queue.length).toBe(0);
    expect(loader.cache.length).toBe(0);
    expect(typeof loader.onLoad).toBe('object');
    expect(typeof loader.onComplete).toBe('object');
    expect(typeof loader.onStart).toBe('object');
    expect(typeof loader.onQueued).toBe('object');
  });

  it('should add audio to the queue', function () {
    loader.addAudio('tic', '../assets/audio/tic.mp3');
    expect(loader.queue.length).toBe(1);
    expect(loader.queue[0].name).toBe('tic');
    expect(loader.queue[0].url).toBe('../assets/audio/tic.mp3');
    expect(loader.queue[0].type).toBe('audio');
  });

  it('should add AudioBuffer to the queue', function () {
    loader.addAudioBuffer('tic', '../assets/audio/tic.mp3');
    expect(loader.queue.length).toBe(2);
    expect(loader.queue[1].name).toBe('tic');
    expect(loader.queue[1].url).toBe('../assets/audio/tic.mp3');
    expect(loader.queue[1].type).toBe('audio-buffer');
  });

  it('should add an image to the queue', function () {
    loader.addImage('brick', '../assets/audio/brick.png');
    expect(loader.queue.length).toBe(3);
    expect(loader.queue[2].name).toBe('brick');
    expect(loader.queue[2].url).toBe('../assets/audio/brick.png');
    expect(loader.queue[2].type).toBe('image');
  });

  it('should add JSON to the queue', function () {
    loader.addJSON('test', '../assets/json/test.json');
    expect(loader.queue.length).toBe(4);
    expect(loader.queue[3].name).toBe('test');
    expect(loader.queue[3].url).toBe('../assets/json/test.json');
    expect(loader.queue[3].type).toBe('json');
  });
});
