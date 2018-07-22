var testState = new naive.State('test-state');

testState.preload = function (game) {
  game.loader.addImage('brick', '../assets/images/brick.png');
};

testState.create = function (game) {
  game.shared.image = game.loader.getImage('brick');
  game.shared.imageX = 200;
  game.shared.imageY = 100;
  game.shared.foreground = new naive.Canvas('.container');
  game.shared.ArrowUp = game.keys.add('ArrowUp');
  game.shared.ArrowRight = game.keys.add('ArrowRight');
  game.shared.ArrowDown = game.keys.add('ArrowDown');
  game.shared.ArrowLeft = game.keys.add('ArrowLeft');
};

testState.update = function (game) {
  if (game.shared.ArrowUp.pressed) console.log('pressed');
  if (game.shared.ArrowUp.pressing) console.log('pressing', game.shared.ArrowUp.holdTime);
  if (game.shared.ArrowUp.released) console.log('released');

  if (game.shared.ArrowUp.pressing) {
    game.shared.imageY -= 1;
  };
  if (game.shared.ArrowRight.pressing) {
    game.shared.imageX += 1;
  };
  if (game.shared.ArrowDown.pressing) {
    game.shared.imageY += 1;
  };
  if (game.shared.ArrowLeft.pressing) {
    game.shared.imageX += -1;
  };
    
  game.shared.foreground.clear();
  game.shared.foreground.text(10, 30, 'fps: ' + 1 / game.loop.delta * 1000);
  game.shared.foreground.image(game.shared.image, game.shared.imageX, game.shared.imageY);
};
