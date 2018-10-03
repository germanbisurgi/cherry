var setupState = new naive.State('setup-state');

setupState.preload = function (game) {
  game.loader.addImage('circle', './assets/images/circle.png');
  game.loader.addImage('brick', './assets/images/brick.png');
};

setupState.create = function (game, $) {
  // canvas
  $.canvas = new naive.Canvas('.container');

  game.loop.fps = 30;

  // keys
  $.arrowUp = game.keys.add('ArrowUp');
  $.arrorRight = game.keys.add('ArrowRight');
  $.arrowDown = game.keys.add('ArrowDown');
  $.arrowLeft = game.keys.add('ArrowLeft');

  // pointers
  $.pointer1 = game.pointers.add();
  $.pointer2 = game.pointers.add();

  game.pointers.enablePointers($.canvas.canvas);

  game.physics = new Physics(game.loop.fps, $.canvas.context);
  game.physics.setGravity(0, 10);

  game.state.switch('test-state');
};
