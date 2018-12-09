var mapState = new naive.State('map-state');
mapState.create = function (game, $) {

  game.physics.setGravity(0, 0);

  var map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  var tileSize = 15;
  var posX;
  var posY;

  map.forEach(function (row, y) {
    row.forEach(function (tile, x) {
      posX = x * tileSize + tileSize / 2;
      posY = y * tileSize + tileSize / 2;
      if (tile === 1) {
        $.bolaAnchor = game.physics.addBody(posX, posY, 'static');
        $.bolaAnchor.addRectangle(0, 0, tileSize, tileSize);
      }
      if (tile === 2) {
        $.ball = game.physics.addBody(posX, posY, 'dynamic');
        $.ball.addCircle(0, 0, 20);
      }
      if (tile === 3) {
        var anchor = game.physics.addBody(posX, posY, 'kinematic');
        anchor.addCircle(0, 0, 10);
        anchor.setAngularVelocity(1000);
        var bola = game.physics.addBody(posX, posY, 'dynamic');
        bola.addCircle(0, 0, 15);
        game.physics.createDistanceJoint(anchor, bola, 30, 10, 0, 0, 0, 3, 0.25, true);
      }
    });
  });

};

mapState.update = function (game, $) {

  if ($.arrowUp.hold) {
    $.ball.applyForce({x: 0, y: ($.ball.getMass() * -4)}, $.ball.getWorldCenter());
  }
  if ($.arrorRight.hold) {
    $.ball.applyForce({x: $.ball.getMass() * 4, y: 0}, $.ball.getWorldCenter());
  }
  if ($.arrowDown.hold) {
    $.ball.applyForce({x: 0, y: $.ball.getMass() * 4}, $.ball.getWorldCenter());
  }
  if ($.arrowLeft.hold) {
    $.ball.applyForce({x: $.ball.getMass() * -4, y: 0}, $.ball.getWorldCenter());
  }

  game.pointers.pointers.forEach(function (pointer) {
    if (pointer.start) {
      game.physics.dragStart(pointer);
    }
    if (pointer.hold) {
      game.physics.dragMove(pointer);
    }
    if (pointer.end) {
      game.physics.dragEnd(pointer);
    }
  });

};

mapState.render = function () {
  game.pointers.pointers.forEach(function (p) {
    if (p.active) {
      game.render.canvas.text(p.x - 70, p.y - 50, 'n: ' + p.number + ' time: ' + Math.floor(p.holdTime));
      game.render.canvas.image(game.assets.getImage('circle'), p.x, p.y, 40, 40);
    }
  });
  game.render.canvas.text(10, 30, 'fps: ' + 1 / game.loop.delta * 1000);
};
