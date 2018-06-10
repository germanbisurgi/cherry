window.addEventListener('load', function () {

  var canvas = document.querySelector('canvas');
  var context = canvas.getContext('2d');
  var game = new cherry.Game();
  var state = new cherry.State('test');
  var debug = new cherry.Debug(context);

  state.preload = function (game) {};
  state.create = function (game) {};
  state.update = function (game) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    debug.print(10, 10, {
      frame: 'frame: ' + game.loop.frame,
      delta: 'delta: ' + game.loop.delta,
      fps: 'fps: ' + 1 / game.loop.delta * 1000
    });
  };

  game.states.add(state);
  game.states.switch('test');
  game.loop.start();

});
