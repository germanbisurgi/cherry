var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var fontSize = 15;
var lines = 1;
ctx.font = fontSize + 'px Arial';

var newLine = function (text) {
  ctx.fillText(text, fontSize, (fontSize * 2) * lines);
  lines++;
};

var testState = new cherry.state('test');

testState.preload = function (game) {};

testState.create = function (game) {};

testState.update = function (game) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lines = 1;
  newLine('frame: ' + game.loop.frame);
  newLine('delta (ms): ' + game.loop.delta);
  newLine('fps: ' + 1 / game.loop.delta * 1000);
};
