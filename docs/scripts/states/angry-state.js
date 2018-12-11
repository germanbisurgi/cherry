var angryState = new naive.State('angry-state');
var player;
var slingshot;
var enemy;
var distanceJoint;
var distance;
var angle;
var canLaunch;
var angryFace;

angryState.create = function (game) {

  game.physics.setGravity(0, 5);
  game.loop.fps = 25;

  // ground
  var ground = game.physics.addBody(window.innerWidth / 2, window.innerHeight - 50, 'static');
  ground.addEdge(-1000, 0, 1000, 0);
  angryFace = game.render.addRenderable(game.assets.getImage('angry-face'), 50, 50, 50, 50, 0);

  // player
  player = game.physics.addBody(350, window.innerHeight - 50, 'dynamic', {bullet: true});
  player.addCircle(25);

  // slingshot
  slingshot = game.physics.addBody(350, window.innerHeight - 200, 'static');
  // slingshot.addCircle(20);

  // enemy
  enemy = game.physics.addBody(1350, window.innerHeight - 50, 'dynamic');
  enemy.addCircle(30);

  // boxes
  game.physics.addBody(1250, window.innerHeight - 50 - 20, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(1250, window.innerHeight - 50 - 60, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(1250, window.innerHeight - 50 - 100, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(1450, window.innerHeight - 50 - 20, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(1450, window.innerHeight - 50 - 60, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(1450, window.innerHeight - 50 - 100, 'dynamic').addRectangle(40, 40);
  game.physics.addBody(1350, window.innerHeight - 50 - 140, 'dynamic').addRectangle(200, 40);

  player.onDragStart = function () {
    canLaunch = true;
    distanceJoint = game.physics.createDistanceJoint(slingshot, player, 0, 0, 0, 0, 0, 3, 0.25, false);
  };

  player.onDragMove = function () {
    distance = game.calc.distance(player.getPosition(), slingshot.getPosition());
    if (distance > 200) {
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

angryState.update = function (game) {

  angryFace.x = player.getPosition().x;
  angryFace.y = player.getPosition().y;
  angryFace.angle = player.getAngle();

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

angryState.render = function () {
  game.pointers.pointers.forEach(function (p) {
    if (p.active) {
      game.render.canvas.text(p.x - 70, p.y - 50, 'n: ' + p.number + ' time: ' + Math.floor(p.holdTime));
      game.render.canvas.image(game.assets.getImage('circle'), p.x, p.y, 40, 40);
    }
  });
  game.render.canvas.text(10, 30, 'fps: ' + 1 / game.loop.delta * 1000);
};
