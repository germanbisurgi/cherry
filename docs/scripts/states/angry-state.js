var angryState = new naive.State('angry-state');
var player;
var slingshot;
var enemy;
var distanceJoint;
var distance;
var angle;
var canLaunch;
var dragging = false;

angryState.create = function (game) {

  // --------------------------------------------------------------------- setup

  game.physics.setGravity(0, 5);
  game.loop.fps = 50;
  game.render.camera.position = {x: 0, y: -200};
  game.render.camera.zoom = 0.8;

  // ------------------------------------------------------- bodies and fixtures

  // ground
  var ground = game.physics.addBody(150, 250, 'static');
  ground.addEdge(-10000, 0, 10000, 0);
  ground.addRenderable(game.assets.getImage('ground'), 10000, 50, 0, 25);

  // slingshot
  slingshot = game.physics.addBody(150, 100, 'static');
  slingshot.addCircle(150, 0, 0, {isSensor: true});
  slingshot.addRenderable(game.assets.getImage('circle'), 300, 300);
  slingshot.addRenderable(game.assets.getImage('slingshot'), 100, 200, -10, 50);

  // player
  player = game.physics.addBody(100, 150, 'dynamic', {bullet: true});
  player.addCircle(25);
  player.addRenderable(game.assets.getImage('angry-face'), 51, 51);
  player.draggable = true;

  /* var torso = game.physics.addBody(100, 150, 'dynamic');
  torso.addRectangle(20, 50);
  torso.draggable = true;
  game.physics.createRevoluteJoint(player, torso, 0, 0, 0, -50, 0, 0, false, -30, 30, true, false);

  var arm = game.physics.addBody(100, 150, 'dynamic');
  arm.addRectangle(10, 30);
  arm.draggable = true;
  game.physics.createRevoluteJoint(torso, arm, 0, -10, 0, -10, 0, 0, false, 0, 0, false, false);

  var leg = game.physics.addBody(100, 150, 'dynamic');
  leg.addRectangle(15, 40);
  leg.draggable = true;
  game.physics.createRevoluteJoint(torso, leg, 0, 20, 0, -10, 0, 0, false, 0, 0, false, false); */

  // enemy
  enemy = game.physics.addBody(1450, 220, 'dynamic');
  enemy.addCircle(30);
  enemy.addRenderable(game.assets.getImage('yellow-face'), 60, 60);

  // boxes
  var box;
  box = game.physics.addBody(1350, 230, 'dynamic');
  box.addRectangle(40, 40);
  box.addRenderable(game.assets.getImage('block'), 40, 40);
  box = game.physics.addBody(1350, 190, 'dynamic');
  box.addRectangle(40, 40);
  box.addRenderable(game.assets.getImage('block'), 40, 40);
  box = game.physics.addBody(1350, 150, 'dynamic');
  box.addRectangle(40, 40);
  box.addRenderable(game.assets.getImage('block'), 40, 40);
  box = game.physics.addBody(1570, 230, 'dynamic');
  box.addRectangle(40, 40);
  box.addRenderable(game.assets.getImage('block'), 40, 40);
  box = game.physics.addBody(1570, 190, 'dynamic');
  box.addRectangle(40, 40);
  box.addRenderable(game.assets.getImage('block'), 40, 40);
  box = game.physics.addBody(1570, 150, 'dynamic');
  box.addRectangle(40, 40);
  box.addRenderable(game.assets.getImage('block'), 40, 40);
  box = game.physics.addBody(1460, 110, 'dynamic');
  box.addRectangle(260, 40);
  box.addRenderable(game.assets.getImage('block'), 260, 40);

  // --------------------------------------------------------------- drag events

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
          x: Math.cos(angle) * distance * 3,
          y: Math.sin(angle) * distance * 3
        },
        player.getWorldCenter()
      );
    }
  };

};

angryState.update = function (game, $) {

  // ------------------------------------------------------------------ pointers

  if ($.pointer1.hold && !$.pointer2.hold && !dragging) {
    game.render.camera.position.x += ($.pointer1.x - $.pointer1.startX) / 5;
    game.render.camera.position.y += ($.pointer1.y - $.pointer1.startY) / 5;
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
      game.render.camera.zoom += 0.01;
    }

    if (currentDistance < startDistance) {
      game.render.camera.zoom -= 0.01;
    }
  }

  // ---------------------------------------------------------------------- keys

  if ($.arrowUp.hold) {
    game.render.camera.position.y -= 15;
  }
  if ($.arrorRight.hold) {
    game.render.camera.position.x += 15;
  }
  if ($.arrowDown.hold) {
    game.render.camera.position.y += 15;
  }
  if ($.arrowLeft.hold) {
    game.render.camera.position.x -= 15;
  }

  if ($.w.hold) {
    game.render.camera.zoom += 0.01;
  }
  if ($.d.hold) {
    game.render.camera.angle -= 0.1;
  }
  if ($.s.hold) {
    game.render.camera.zoom -= 0.01;
  }
  if ($.a.hold) {
    game.render.camera.angle += 0.1;
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

};

angryState.render = function () {
  game.pointers.pointers.forEach(function (p) {
    if (p.active) {
      game.render.canvas.text(p.x - 70, p.y - 50, 'n: ' + p.id + ' time: ' + Math.floor(p.holdTime));
      game.render.canvas.image(game.assets.getImage('circle'), p.x, p.y, 40, 40);
    }
  });
  game.render.canvas.text(game.render.camera.width - 150, 30, 'fps: ' + Math.floor(1 / game.loop.delta * 1000));

  // game.render.canvas.grid(0, 0, 50, 50, 10, 10);
};
