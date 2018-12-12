var angryState = new naive.State('angry-state');
var player;
var slingshot;
var enemy;
var distanceJoint;
var distance;
var angle;
var canLaunch;

angryState.create = function (game) {

  game.physics.setGravity(0, 5);
  game.loop.fps = 25;

  // ground
  var ground = game.physics.addBody(150, 250, 'static');
  ground.addEdge(-1000, 0, 1000, 0);

  // slingshot
  slingshot = game.physics.addBody(150, 150, 'static');
  slingshot.addCircle(100, 0, 0, {isSensor: true});

  // player
  player = game.physics.addBody(100, 150, 'dynamic', {bullet: true});
  player.addCircle(25);
  player.draggable = true;

  // enemy
  enemy = game.physics.addBody(450, 220, 'dynamic');
  enemy.addCircle(30);

  // boxes
  game.physics.addBody(350, 230, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(350, 190, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(350, 150, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(570, 230, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(570, 190, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(570, 150, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(460, 110, 'dynamic').addRectangle(260, 40);

  player.onDragStart = function () {
    canLaunch = true;
    distanceJoint = game.physics.createDistanceJoint(slingshot, player, 0, 0, 0, 0, 0, 3, 0.25, false);
  };

  player.onDragMove = function () {
    distance = game.calc.distance(player.getPosition(), slingshot.getPosition());
    if (distance > 100) {
      canLaunch = false;
      game.physics.destroyJoint(distanceJoint);
    }
  };

  player.onDragEnd = function () {
    game.physics.destroyJoint(distanceJoint);
    angle = game.calc.angleBetweenPoints(player.getPosition(), slingshot.getPosition());
    distance = game.calc.distance(player.getPosition(), slingshot.getPosition());
    if (canLaunch) {
      player.applyImpulse(
        {
          x: Math.cos(angle) * distance * 4,
          y: Math.sin(angle) * distance * 4
        },
        player.getWorldCenter());
    }
  };
};

angryState.update = function (game, $) {

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

  if ($.arrowUp.hold) {
    game.camera.zoom += 0.01;
  }
  if ($.arrorRight.hold) {
    game.camera.angle += 0.01;
  }
  if ($.arrowDown.hold) {
    game.camera.zoom -= 0.01;
  }
  if ($.arrowLeft.hold) {
    game.camera.angle -= 0.01;
  }
  // game.camera.follow(player.getPosition());
};

angryState.render = function () {
  game.pointers.pointers.forEach(function (p) {
    if (p.active) {
      game.canvas.text(p.x - 70, p.y - 50, 'n: ' + p.number + ' time: ' + Math.floor(p.holdTime));
      game.canvas.image(game.assets.getImage('circle'), p.x, p.y, 40, 40);
    }
  });
  game.canvas.text(10, 30, 'fps: ' + 1 / game.loop.delta * 1000);
};
