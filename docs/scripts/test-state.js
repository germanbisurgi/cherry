var testState = new naive.State('test-state');
var Q = {};

testState.preload = function (game) {
  game.loader.addImage('circle', './assets/images/circle.png');
};

testState.create = function (game) {

  game.loop.fps = 10;

  Q.image = game.loader.getImage('circle');
  Q.imageVel = 5;
  Q.imageX = 200;
  Q.imageY = 100;

  Q.foreground = new naive.Canvas('.container');

  game.pointers.enable(Q.foreground.canvas);

};

testState.update = function (game) {
  game.keys.onPress(['a', 's'], function () {
    console.log('onPress a + s');
  });

  game.keys.onHold(['s'], function (holdTime) {
    console.log('onHold s', holdTime);
  });

  game.keys.onHold(['a', 's'], function (holdTime) {
    console.log('onHold a + s', holdTime);
  });

  game.keys.onRelease(['a', 's'], function () {
    console.log('onRelease a + s');
  });
};

testState.render = function (game) {
  Q.foreground.clear();
  Q.foreground.text(10, 30, 'fps: ' + 1 / game.loop.delta * 1000);
  Q.foreground.text(10, 60, JSON.stringify(game.pointers.tracked.used));
  game.pointers.tracked.each(function (pointer) {
    Q.foreground.text(pointer.x - 5, pointer.y - 50, pointer.number);
    Q.foreground.image(Q.image, pointer.x, pointer.y, 80, 80);
  });
};
