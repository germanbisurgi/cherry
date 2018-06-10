window.addEventListener('load', function () {
  var canvas = document.querySelector('canvas');
  var context = canvas.getContext('2d');
  var debug = new cherry.Debug(context);
  var testState = new cherry.State('test');

  testState.preload = function (game) {};

  testState.create = function (game) {};

  testState.update = function (game) {

    context.clearRect(0, 0, canvas.width, canvas.height);

    debug.print(10, 10, {
      frame: 'frame: ' + game.loop.frame,
      delta: 'delta: ' + game.loop.delta,
      fps: 'fps: ' + 1 / game.loop.delta * 1000
    });

  };

  var game = new cherry.Game();
  game.states.add(testState);
  game.states.switch('test');
  game.loop.start();
});
