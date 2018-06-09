window.addEventListener('load', function () {
  var game = new cherry.game();
  game.states.add(testState);
  game.states.switch('test');
  game.loop.start();
});
