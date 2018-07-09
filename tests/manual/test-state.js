var game = null;
var image = null;
var foreground = null;
var offscreen = null;

var testState = new naive.State('test-state');

testState.preload = function (game) {
  // console.log('preload');
  game.loader.addImage('brick', '../assets/images/brick.png');
};

testState.create = function (game) {
  // console.log('create');
  image = game.loader.getImage('brick');
  foreground = new naive.Canvas('.container');
};

testState.update = function (game) {
  foreground.clear();
  foreground.text(10, 30, 'fps: ' + 1 / game.loop.delta * 1000);
  foreground.image(image, 200, 100);
};
