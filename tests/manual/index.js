var game = null;

window.addEventListener('load', function () {

  game = new naive.Game();
  var canvas = document.querySelector('canvas');
  var context = canvas.getContext('2d');
  var debug = new naive.Debug(context);
  var state = new naive.State('test');

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
      cache: 'cache: ' + game.loader.cache.length
    });
  };

  game.state.add(state);
  game.state.switch('test');
  game.loop.start();

});
