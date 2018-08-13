var testState = new naive.State('test-state');
var $ = {};

testState.preload = function (game) {
  game.loader.addImage('circle', './assets/images/circle.png');
};

testState.create = function (game) {

  $.foreground = new naive.Canvas('.container');
  $.image = game.loader.getImage('circle');
  $.imageVel = 5;
  $.imageX = 200;
  $.imageY = 100;

  // game.loop.fps = 10;
  game.inputs.enablePointers($.foreground.canvas);

  $.arrowUp = game.inputs.addKey('ArrowUp');
  $.pointer1 = game.inputs.addPointer();
  $.pointer2 = game.inputs.addPointer();
};

testState.update = function (game) {
  if ($.arrowUp.isHolded) {
    // console.log('arrowUp is holded');
  }
};

testState.render = function (game) {
  $.foreground.clear();
  
  $.foreground.text(10, 30, 'fps: ' + 1 / game.loop.delta * 1000);

  game.inputs.pointers.forEach(function (pointer) {
    if (pointer.active) {
      $.foreground.text(pointer.x - 70, pointer.y - 50, 'n: ' + pointer.number + ' time: ' + Math.floor(pointer.holdTime));
      $.foreground.image($.image, pointer.x, pointer.y, 80, 80);
    }
  });
};
