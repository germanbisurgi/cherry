var testState = new naive.State('test-state');
testState.create = function (game, $) {

  game.world.setGravity(0, 10);

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

  var kinematicEdge = game.world.addBody(350, 350, 'kinematic');
  kinematicEdge.addEdge(0, 0, -30, -100);
  kinematicEdge.addEdge(0, 0, 30, -100);
  kinematicEdge.setAngularVelocity(100);

  var kinematicCircle = game.world.addBody(50, 200, 'kinematic');
  kinematicCircle.addCircle(0, 0, 30);
  kinematicCircle.setAngularVelocity(300);

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

  $.ball = game.world.addBody(50, 350, 'dynamic');
  $.ball.addCircle(0, 0, 20);

  var circle = game.world.addBody(50, 350, 'dynamic');
  circle.addCircle(0, 0, 40);

  var rectangle = game.world.addBody(150, 350, 'dynamic');
  rectangle.addRectangle(0, 0, 40, 40);

  var prismaticRectangleA = game.world.addBody(350, 350, 'dynamic');
  prismaticRectangleA.addRectangle(0, 0, 40, 40);

  var pulleyCircleA = game.world.addBody(50, 350, 'dynamic');
  pulleyCircleA.addCircle(0, 0, 40);

  var pulleyCircleB = game.world.addBody(50, 350, 'dynamic');
  pulleyCircleB.addCircle(0, 0, 40);

  polygon = game.world.addBody(250, 350, 'dynamic');
  polygon.addPolygon(0, 0, [
    {x: 0, y: 0},
    {x: 30, y: 60},
    {x: -30, y: 60}
  ]);

  // --------------------------------------------------------------------- joint

  game.world.createDistanceJoint(kinematicCircle, circle, 75, 30, 0, 0, 0, 2, 0.25, false);
  game.world.createRevoluteJoint(polygon, rectangle, 0, 0, 0, 0, 50, 200, true, 0, 0, false, false);
  game.world.createPrismaticJoint(staticRectangle, prismaticRectangleA, 1, 0, 0, 0, 0, 0, 0, 50, true, 30, 30, true, false);
  game.world.createPulleyJoint(pulleyCircleA, pulleyCircleB, 400, 50, 500, 50, 0, 0, 0, 0, 1, 100, 100);

};

testState.update = function (game, $) {
  game.pointers.pointers.forEach(function (pointer) {
    if (pointer.start) {
      game.world.dragStart(pointer);
    }
    if (pointer.hold) {
      game.world.dragMove(pointer);
    }
    if (pointer.end) {
      game.world.dragEnd(pointer);
    }
  });

  // if ($.arrowUp.start) {}
  // if ($.arrowUp.end) {}

  if ($.arrowUp.hold) {
    $.ball.applyForce({x: 0, y: ($.ball.getMass() * -10) - 10}, $.ball.getWorldCenter());
  }
  if ($.arrorRight.hold) {
    $.ball.applyForce({x: $.ball.getMass() * 2, y: 0}, $.ball.getWorldCenter());
  }
  if ($.arrowDown.hold) {
    $.ball.applyForce({x: 0, y: 501}, $.ball.getWorldCenter());
  }
  if ($.arrowLeft.hold) {
    $.ball.applyForce({x: $.ball.getMass() * -2, y: 0}, $.ball.getWorldCenter());
  }
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
