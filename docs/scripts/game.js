var game = null;
window.addEventListener('load', function () {
  game = new naive.Game();
  game.state.add(setupState);
  game.state.add(testState);
  game.state.switch('setup-state');
  game.loop.start();
});
