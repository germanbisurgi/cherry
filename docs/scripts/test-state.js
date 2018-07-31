var testState = new naive.State('test-state');
var Q = {};

testState.preload = function (game) {
  game.loader.addImage('circle', './assets/images/circle.png');
};

testState.create = function (game) {

  Q.foreground = new naive.Canvas('.container');

  Q.image = game.loader.getImage('circle');
  Q.imageVel = 5;
  Q.imageX = 200;
  Q.imageY = 100;

  game.loop.fps = 10;
  game.pointers.enable(Q.foreground.canvas);

};

testState.update = function (game) {
  game.keys.onDown(['a', 's'], function () {
  });

  game.keys.onHold(['s'], function (holdTime) {
  });

  game.keys.onHold(['a', 's'], function (holdTime) {
  });

  game.keys.onUp(['a', 's'], function () {
  });
};

testState.render = function (game) {
  Q.foreground.clear();
  Q.foreground.text(10, 30, 'fps: ' + 1 / game.loop.delta * 1000);

  game.pointers.tracked.forEach(function (pointer) {
    // console.log(pointer);
    Q.foreground.text(pointer.x - 5, pointer.y - 50, pointer.number);
    Q.foreground.image(Q.image, pointer.x, pointer.y, 80, 80);
  });
};
