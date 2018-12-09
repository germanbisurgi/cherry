var game = null;
window.addEventListener('load', function () {
  game = new naive.Game();
  game.state.add(physicsState);
  game.state.switch('test-state');
  game.loop.start();
});
