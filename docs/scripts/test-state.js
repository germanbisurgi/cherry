var testState = new naive.State('test-state');
var _ = {};

testState.preload = function (game) {
  game.loader.addImage('circle', './assets/images/circle.png');
};

testState.create = function (game) {

  _.foreground = new naive.Canvas('.container');
  _.image = game.loader.getImage('circle');
  _.imageVel = 5;
  _.imageX = 200;
  _.imageY = 100;

  // game.loop.fps = 10;
  game.pointers.enable(_.foreground.canvas);

  _.arrowUp = game.keys.add('ArrowUp');
  _.pointer1 = game.pointers.add();
  _.pointer2 = game.pointers.add();
};

testState.update = function (game) {
};

testState.render = function (game) {
  _.foreground.clear();
  _.foreground.text(10, 30, 'fps: ' + 1 / game.loop.delta * 1000);

  game.pointers.tracked.forEach(function (pointer) {
    if (pointer.active) {
      _.foreground.text(pointer.x - 70, pointer.y - 50, 'n: ' + pointer.number + ' time: ' + Math.floor(pointer.holdTime));
      _.foreground.image(_.image, pointer.x, pointer.y, 80, 80);
    }

  });
};
