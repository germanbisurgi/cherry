var setupState = new naive.State('setup-state');

setupState.preload = function (game) {
  game.assets.addImage('angry-face', './assets/images/angry-face.png');
  game.assets.addImage('circle', './assets/images/circle.png');
  game.assets.addImage('brick', './assets/images/brick.png');
};

setupState.create = function (game, $) {
  // keys: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
  $.arrowUp = game.keys.add('ArrowUp');
  $.arrorRight = game.keys.add('ArrowRight');
  $.arrowDown = game.keys.add('ArrowDown');
  $.arrowLeft = game.keys.add('ArrowLeft');
  $.w = game.keys.add('w');
  $.d = game.keys.add('d');
  $.s = game.keys.add('s');
  $.a = game.keys.add('a');
  $.u = game.keys.add('u');
  $.k = game.keys.add('k');
  $.j = game.keys.add('j');
  $.h = game.keys.add('h');
  // pointers
  $.pointer1 = game.pointers.add();
  $.pointer2 = game.pointers.add();

  game.state.switch('angry-state');
};
