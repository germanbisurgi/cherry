var testState = new naive.State('test-state');

testState.preload = function (game) {
  game.loader.addImage('circle', './assets/images/circle.png');
  game.loader.addImage('brick', './assets/images/brick.png');
};

testState.create = function (game, $) {
  $.canvas = new naive.Canvas('.container');
  game.inputs.enablePointers($.canvas.canvas);

  // keys.
  $.AU = game.inputs.addKey('ArrowUp');
  $.AR = game.inputs.addKey('ArrowRight');
  $.AD = game.inputs.addKey('ArrowDown');
  $.AL = game.inputs.addKey('ArrowLeft');
  // pointers.
  $.p1 = game.inputs.addPointer();
  $.p2 = game.inputs.addPointer();
  // brick.
  $.brick = new Brick(300, 300, 5, 'brick');
  $.grid = new Grid(0, 0, 400, 400, 6, 6);
};

testState.update = function (game, $) {
  // keys.
  if ($.AU.isHolded) {
    $.brick.y -= $.brick.velocity;
  }
  if ($.AR.isHolded) {
    $.brick.x += $.brick.velocity;
  }
  if ($.AD.isHolded) {
    $.brick.y += $.brick.velocity;
  }
  if ($.AL.isHolded) {
    $.brick.x -= $.brick.velocity;
  }
};

testState.render = function (game, $) {
  // clear canvas.
  $.canvas.clear();
  // write fps.
  $.canvas.text(10, 30, 'fps: ' + 1 / game.loop.delta * 1000);
  // renders a brick.
  $.brick.draw($.canvas);
  // renders a line.
  $.canvas.line(0, 0, $.brick.x, $.brick.y);
  // renders a grid.
  $.grid.draw($.canvas);
  // render a circle for each pointer.
  game.inputs.pointers.forEach(function (p) {
    if (p.active) {
      $.canvas.text(p.x - 70, p.y - 50, 'n: ' + p.number + ' time: ' + Math.floor(p.holdTime));
      $.canvas.circle(p.x, p.y, 40);
    }
  });
};
