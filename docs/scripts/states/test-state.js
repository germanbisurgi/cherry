var testState = new naive.State('test-state');

testState.create = function (game, $) {
  $.player = new Player('brick', 100, 100, 32, 32);
  $.edges = [
    new Edge(10, 10, 400, 10),
    new Edge(400, 10, 400, 400),
    new Edge(400, 400, 10, 400),
    new Edge(10, 400, 10, 10)
  ];
};

testState.update = function (game, $) {

  game.physics.update();
  $.player.update(game);

  game.pointers.pointers.forEach(function (p) {
    if (p.isDown) {
      game.physics.dragStart(p);
    }
    if (p.isHolded) {
      game.physics.dragMove(p);
    }
    if (p.isUp) {
      game.physics.dragEnd(p);
    }
  });

};

testState.render = function (game, $) {
  $.canvas.clear();

  $.edges.forEach(function (edge) {
    edge.draw($.canvas);
  });

  $.player.draw($.canvas);
  game.physics.draw();
  game.pointers.pointers.forEach(function (p) {
    if (p.active) {
      $.canvas.text(p.x - 70, p.y - 50, 'n: ' + p.number + ' time: ' + Math.floor(p.holdTime));
      $.canvas.image(game.loader.getImage('circle'), p.x, p.y, 40, 40);
    }
  });
  $.canvas.text(10, 30, 'fps: ' + 1 / game.loop.delta * 1000);
};
