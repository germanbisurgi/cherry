var setupState = new naive.State('setup-state');

setupState.preload = function (game) {
  game.loader.addImage('circle', './assets/images/circle.png');
  game.loader.addImage('brick', './assets/images/brick.png');
};

setupState.create = function (game, $) {
  // keys
  $.arrowUp = game.keys.add('ArrowUp');
  $.arrorRight = game.keys.add('ArrowRight');
  $.arrowDown = game.keys.add('ArrowDown');
  $.arrowLeft = game.keys.add('ArrowLeft');

  // pointers
  $.pointer1 = game.pointers.add();
  $.pointer2 = game.pointers.add();

  game.state.switch('test-state');
};