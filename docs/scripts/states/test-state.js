var testState = new naive.State('test-state');
testState.create = function (game, $) {

  game.world.setGravity(0, 10);

  var world = {
    width: 200,
    height: 200
  };

  // -------------------------------------------------------------------- static

  var staticEdge = game.world.addBody(0, window.innerHeight - 50, 'static');
  staticEdge.addEdge(0, 0, window.innerWidth, 0);

  var staticCircle = game.world.addBody(50, 50, 'static');
  staticCircle.addCircle(0, 0, 30);

  var staticRectangle = game.world.addBody(150, 50, 'static');
  staticRectangle.addRectangle(0, 0, 40, 40);

  var staticPolygon = game.world.addBody(250, 50, 'static');
  staticPolygon.addPolygon(0, 0, [
    {x: 0, y: 0},
    {x: 30, y: 60},
    {x: -30, y: 60}
  ]);

  // ----------------------------------------------------------------- kinematic

  var kinematicEdge = game.world.addBody(300, 200, 'kinematic');
  kinematicEdge.addEdge(0, 0, -30, -100);
  kinematicEdge.addEdge(0, 0, 30, -100);
  kinematicEdge.setAngularVelocity(40);

  var kinematicCircle = game.world.addBody(50, 200, 'kinematic');
  kinematicCircle.addCircle(0, 0, 30);
  kinematicCircle.setAngularVelocity(40);

  var kinematicRectangle = game.world.addBody(150, 200, 'kinematic');
  kinematicRectangle.addRectangle(0, 0, 40, 40);
  kinematicRectangle.setAngularVelocity(40);

  var kinematicPolygon = game.world.addBody(250, 200, 'kinematic');
  kinematicPolygon.addPolygon(0, 0, [
    {x: 0, y: 0},
    {x: 30, y: 60},
    {x: -30, y: 60}
  ]);
  kinematicPolygon.setAngularVelocity(40);

  // ------------------------------------------------------------------- dynamic

  var circle = game.world.addBody(50, 350, 'dynamic');
  circle.addCircle(0, 0, 40);

  var rectangle = game.world.addBody(150, 350, 'dynamic');
  rectangle.addRectangle(0, 0, 40, 40);

  var polygon = game.world.addBody(250, 350, 'dynamic');
  polygon.addPolygon(0, 0, [
    {x: 0, y: 0},
    {x: 30, y: 60},
    {x: -30, y: 60}
  ]);

  // --------------------------------------------------------------------- joint

  game.world.createDistanceJoint({
    bodyA: kinematicCircle,
    bodyB: circle,
    length: 75,
    ax: 0,
    ay: 0,
    bx: 0,
    by: 0,
    frequencyHz: 2,
    damping: 0.25,
    collideConnected: false
  });

  game.world.createRevoluteJoint({
    bodyA: polygon,
    bodyB: rectangle,
    ax: -0,
    ay: 0,
    bx: 0,
    by: 0,
    motorSpeed: 5 * 10,
    maxMotorTorque: 200,
    enableMotor: true,
    lowerAngle: 0,
    upperAngle: 0,
    enableLimit: false,
    collideConnected: false
  });

};

testState.update = function (game, $) {
  game.pointers.pointers.forEach(function (p) {
    if (p.isDown) {
      game.world.dragStart(p);
    }
    if (p.isHolded) {
      game.world.dragMove(p);
    }
    if (p.isUp) {
      game.world.dragEnd(p);
    }
  });
};

testState.render = function (game, $) {
  game.pointers.pointers.forEach(function (p) {
    if (p.active) {
      game.canvas.text(p.x - 70, p.y - 50, 'n: ' + p.number + ' time: ' + Math.floor(p.holdTime));
      game.canvas.image(game.loader.getImage('circle'), p.x, p.y, 40, 40);
    }
  });
  game.canvas.text(10, 30, 'fps: ' + 1 / game.loop.delta * 1000);
};
