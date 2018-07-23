var testState = new naive.State('test-state');
var Q = {};

testState.preload = function (game) {
  game.loader.addImage('circle', './assets/images/circle.png');
};

testState.create = function (game) {
  Q.image = game.loader.getImage('circle');
  Q.imageVel = 5;
  Q.imageX = 200;
  Q.imageY = 100;

  Q.foreground = new naive.Canvas('.container');
  game.pointers.enable(Q.foreground.canvas);

  Q.ArrowUp = game.keys.add('ArrowUp');
  Q.ArrowRight = game.keys.add('ArrowRight');
  Q.ArrowDown = game.keys.add('ArrowDown');
  Q.ArrowLeft = game.keys.add('ArrowLeft');
};

testState.update = function (game) {
  if (Q.ArrowUp.pressing) {
    Q.imageY -= Q.imageVel;
  };
  if (Q.ArrowRight.pressing) {
    Q.imageX += Q.imageVel;
  };
  if (Q.ArrowDown.pressing) {
    Q.imageY += Q.imageVel;
  };
  if (Q.ArrowLeft.pressing) {
    Q.imageX -= Q.imageVel;
  };
};

testState.render = function (game) {
  Q.foreground.clear();
  Q.foreground.text(10, 30, 'fps: ' + 1 / game.loop.delta * 1000);
  Q.foreground.text(10, 60, JSON.stringify(game.pointers.tracked.pool));
  game.pointers.tracked.each(function (pointer, i) {
    Q.foreground.image(Q.image, pointer.x, pointer.y, 80, 80);
    i++;
  });
};
