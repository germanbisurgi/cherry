var mapState = new naive.State('map-state');
var player;
mapState.create = function (game, $) {

  var brick = game.assets.getImage('brick');

  game.physics.setGravity(0, 0);
  game.loop.fps = 25;

  var map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  var tileSize = 15;
  var posX;
  var posY;

  map.forEach(function (row, y) {
    row.forEach(function (tile, x) {
      posX = x * tileSize + tileSize / 2;
      posY = y * tileSize + tileSize / 2;
      if (tile === 1) {
        var body = game.physics.addBody(posX, posY, 'static');
        body.addRectangle(tileSize, tileSize);
        game.render.addRenderable(brick, posX, posY, tileSize, tileSize);
      }
      if (tile === 2) {
        player = new Player(game);
        console.log(player)
      }
      if (tile === 3) {
        var anchor = game.physics.addBody(posX, posY, 'kinematic');
        anchor.addCircle(10);
        anchor.setAngularVelocity(1000);
        var bola = game.physics.addBody(posX, posY, 'dynamic');
        bola.addCircle(15);
        game.physics.createDistanceJoint(anchor, bola, 30, 10, 0, 0, 0, 3, 0.25, true);
      }
    });
  });

};

mapState.update = function (game, $) {

  player.update();

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
