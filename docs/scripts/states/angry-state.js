var angryState = new naive.State('angry-state');
var player;
var slingshot;
var enemy;
var distanceJoint;
var distance;
var angle;
var canLaunch;
var oldPosition;
var newPosition;
var dragging = false;

angryState.create = function (game) {

  game.physics.setGravity(0, 5);
  // game.loop.fps = 25;

  game.camera.position = {x: -200, y: -200};
  game.camera.zoom = 0.8;

  // ground
  var ground = game.physics.addBody(150, 250, 'static');
  ground.addEdge(-10000, 0, 10000, 0);

  // slingshot
  slingshot = game.physics.addBody(150, 100, 'static');
  slingshot.addCircle(150, 0, 0, {isSensor: true});

  // player
  player = game.physics.addBody(100, 150, 'dynamic', {bullet: true});
  player.addCircle(25);
  player.draggable = true;

  var torso = game.physics.addBody(100, 150, 'dynamic');
  torso.addRectangle(20, 50);
  torso.draggable = true;
  game.physics.createRevoluteJoint(player, torso, 0, 0, 0, -50, 0, 0, false, -30, 30, true, false);

  var arm = game.physics.addBody(100, 150, 'dynamic');
  arm.addRectangle(10, 30);
  game.physics.createRevoluteJoint(torso, arm, 0, -10, 0, -10, 0, 0, false, 0, 0, false, false);
  arm.draggable = true;

  var leg = game.physics.addBody(100, 150, 'dynamic');
  leg.addRectangle(15, 40);
  game.physics.createRevoluteJoint(torso, leg, 0, 20, 0, -10, 0, 0, false, 0, 0, false, false);
  leg.draggable = true;

  // enemy
  enemy = game.physics.addBody(1450, 220, 'dynamic');
  enemy.addCircle(30);

  // boxes
  game.physics.addBody(1350, 230, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(1350, 190, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(1350, 150, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(1570, 230, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(1570, 190, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(1570, 150, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(1460, 110, 'dynamic').addRectangle(260, 40);

  player.onDragStart = function () {
    dragging = true;
    canLaunch = true;
    distanceJoint = game.physics.createDistanceJoint(slingshot, player, 0, 0, 0, 0, 0, 3, 0.25, false);
  };

  player.onDragMove = function () {
    dragging = true;
    distance = game.calc.distance(player.getPosition(), slingshot.getPosition());
    if (distance > 150) {
      canLaunch = false;
      game.physics.destroyJoint(distanceJoint);
    }
  };

  player.onDragEnd = function () {
    dragging = false;
    game.physics.destroyJoint(distanceJoint);
    angle = game.calc.angleBetweenPoints(player.getPosition(), slingshot.getPosition());
    distance = game.calc.distance(player.getPosition(), slingshot.getPosition());
    if (canLaunch) {
      player.applyImpulse(
        {
          x: Math.cos(angle) * distance * 5,
          y: Math.sin(angle) * distance * 5
        },
        player.getWorldCenter());
    }
  };
};

angryState.update = function (game, $) {

  if ($.pointer1.hold && !$.pointer2.hold && !dragging) {
    game.camera.position.x += ($.pointer1.x - $.pointer1.startX) / 5;
    game.camera.position.y += ($.pointer1.y - $.pointer1.startY) / 5;
  }

  if ($.pointer1.hold && $.pointer2.hold && !dragging) {
    var startDistance = game.calc.distance(
      {x: $.pointer1.startX, y: $.pointer1.startY},
      {x: $.pointer2.startX, y: $.pointer2.startY},
    );
    var currentDistance = game.calc.distance(
      {x: $.pointer1.x, y: $.pointer1.y},
      {x: $.pointer2.x, y: $.pointer2.y},
    );
    if (currentDistance > startDistance) {
      game.camera.zoom -= 0.01;
    }

    if (currentDistance < startDistance) {
      game.camera.zoom += 0.01;
    }
  }

  game.pointers.pointers.forEach(function (pointer) {
    if (pointer.start) {
      game.physics.dragStart(pointer.getPosition());
    }
    if (pointer.hold) {
      game.physics.dragMove(pointer.getPosition());
    }
    if (pointer.end) {
      game.physics.dragEnd(pointer.getPosition());
    }
  });

  if ($.arrowUp.hold) {
    game.camera.position.y -= 15;
  }
  if ($.arrorRight.hold) {
    game.camera.position.x += 15;
  }
  if ($.arrowDown.hold) {
    game.camera.position.y += 15;
  }
  if ($.arrowLeft.hold) {
    game.camera.position.x -= 15;
  }

  if ($.w.hold) {
    game.camera.zoom += 0.01;
  }
  if ($.d.hold) {
    game.camera.angle -= 0.1;
  }
  if ($.s.hold) {
    game.camera.zoom -= 0.01;
  }
  if ($.a.hold) {
    game.camera.angle += 0.1;
  }

  if ($.u.hold) {
    player.applyImpulse({x: 0, y: -10}, player.getWorldCenter());
  }
  if ($.k.hold) {
    player.applyImpulse({x: 10, y: 0}, player.getWorldCenter());
  }
  if ($.j.hold) {
    player.applyImpulse({x: 0, y: 10}, player.getWorldCenter());
  }
  if ($.h.hold) {
    player.applyImpulse({x: -10, y: 0}, player.getWorldCenter());
  }

  if (!oldPosition) {
    oldPosition = player.getPosition();
  }
  newPosition = player.getPosition();
  var velocity = game.calc.distance(oldPosition, newPosition);
  oldPosition = newPosition;

  if (velocity > 30) {
    // game.camera.zoom = game.calc.lerp(0.05, game.camera.zoom, 0.9);
  } else {
    // game.camera.zoom = game.calc.lerp(0.05, game.camera.zoom, 1);
  }

  // game.camera.zoom /= velocity;
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
