window.addEventListener('load', function () {

  var canvas = document.querySelector('canvas');
  var context = canvas.getContext('2d');
  var game = new naive.Game();
  var state = new naive.State('test');
  var debug = new naive.Debug(context);

  state.preload = function (game) {};
  state.create = function (game) {};
  state.update = function (game) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    debug.print(10, 10, {
      state: 'state: ' + game.state.current.name,
      frame: 'frame: ' + game.loop.frame,
      delta: 'delta: ' + game.loop.delta,
      timestep: 'timestep: ' + game.loop.timestep,
      fps: 'fps: ' + 1 / game.loop.delta * 1000,
      cache: 'cache: ' + 1 / game.loader.cache[0]
    });
  };

  game.state.add(state);
  game.state.switch('test');
  // game.loop.start();

  /* var json = game.loader.loadJSON('./../assets/json/test.json');
  json.then(function (response) {
    console.log(response.name);
  });

  var image = game.loader.loadImage('./../assets/images/brick.png');
  image.then(function (response) {
    console.log(response);
  });

  var audio = game.loader.loadAudio('./../assets/audio/tic.mp3');
  audio.then(function (response) {
    console.log(response);
  });

  var audioBuffer = game.loader.loadAudioBuffer('./../assets/audio/tic.mp3');
  audioBuffer.then(function (response) {
    console.log(response);
  }); */

});
