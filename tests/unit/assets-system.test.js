var naive = require('../../dist/naive');
var assets = new naive.AssetsSystem();

describe('Loader', function () {
  it('should have correct inital values', function () {
    expect(assets.errors).toBe(0);
    expect(assets.success).toBe(0);
    expect(assets.queue.length).toBe(0);
    expect(assets.cache.length).toBe(0);
    expect(typeof assets.onLoad).toBe('object');
    expect(typeof assets.onComplete).toBe('object');
    expect(typeof assets.onStart).toBe('object');
    expect(typeof assets.onQueued).toBe('object');
  });

  it('should add audio to the queue', function () {
    assets.addAudio('tic', '../assets/audio/tic.mp3');
    expect(assets.queue.length).toBe(1);
    expect(assets.queue[0].name).toBe('tic');
    expect(assets.queue[0].url).toBe('../assets/audio/tic.mp3');
    expect(assets.queue[0].type).toBe('audio');
  });

  it('should add AudioBuffer to the queue', function () {
    assets.addAudioBuffer('tic', '../assets/audio/tic.mp3');
    expect(assets.queue.length).toBe(2);
    expect(assets.queue[1].name).toBe('tic');
    expect(assets.queue[1].url).toBe('../assets/audio/tic.mp3');
    expect(assets.queue[1].type).toBe('audio-buffer');
  });

  it('should add an image to the queue', function () {
    assets.addImage('brick', '../assets/audio/brick.png');
    expect(assets.queue.length).toBe(3);
    expect(assets.queue[2].name).toBe('brick');
    expect(assets.queue[2].url).toBe('../assets/audio/brick.png');
    expect(assets.queue[2].type).toBe('image');
  });

  it('should add JSON to the queue', function () {
    assets.addJSON('test', '../assets/json/test.json');
    expect(assets.queue.length).toBe(4);
    expect(assets.queue[3].name).toBe('test');
    expect(assets.queue[3].url).toBe('../assets/json/test.json');
    expect(assets.queue[3].type).toBe('json');
  });
});
