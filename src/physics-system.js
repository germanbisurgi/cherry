var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2Contacts = Box2D.Dynamics.Contacts;
var b2ContactListener = Box2D.Dynamics.b2ContactListener;
var b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJointDef;

var PhysicsSystem = function (game) {
  var self = this;
  self.game = game;
  self.scale = 100; // how many pixels is 1 meter
  self.world = new b2World(new b2Vec2(0, 0), true);
  self.mouseJoints = [];
  self.debugDraw = null;
  self.contacts = new b2ContactListener();
  self.world.SetContactListener(self.contacts);

  // ------------------------------------------------------------------ contacts

  self.contacts.BeginContact = function (contact) {
    contact.GetFixtureA().GetBody().onContactBegin(contact.GetFixtureA(), contact.GetFixtureB());
    contact.GetFixtureB().GetBody().onContactBegin(contact.GetFixtureB(), contact.GetFixtureA());
  };

  self.contacts.EndContact = function (contact) {
    contact.GetFixtureA().GetBody().onContactEnd(contact.GetFixtureA(), contact.GetFixtureB());
    contact.GetFixtureB().GetBody().onContactEnd(contact.GetFixtureB(), contact.GetFixtureA());
  };

  self.contacts.PreSolve = function (contact) {
    contact.GetFixtureA().GetBody().onContactPreSolve(contact.GetFixtureA(), contact.GetFixtureB());
    contact.GetFixtureB().GetBody().onContactPreSolve(contact.GetFixtureB(), contact.GetFixtureA());
  };

  self.contacts.PostSolve = function (contact) {
    contact.GetFixtureA().GetBody().onContactPostSolve(contact.GetFixtureA(), contact.GetFixtureB());
    contact.GetFixtureB().GetBody().onContactPostSolve(contact.GetFixtureB(), contact.GetFixtureA());
  };

  // ------------------------------------------------------------------- setters

  self.setScale = function (scale) {
    self.scale = scale;
  };

  self.setGravity = function (x, y) {
    self.world.SetGravity(new b2Vec2(x, y));
  };

  self.fasterEach = function (array, fn) {
    var length = array.length;
    var i;
    for (i = 0; i < length; i++) {
      fn(array[i], i, array);
    }
  };

  // --------------------------------------------------------------- world query

  self.queryAABB = function (start, current) {
    var fixtures = [];
    var AABB = new Box2D.Collision.b2AABB();
    if (start.x > current.x && start.y < current.y) {
      AABB.lowerBound = {x: current.x / self.scale, y: start.y / self.scale};
      AABB.upperBound = {x: start.x / self.scale, y: current.y / self.scale};
    } else if (start.x < current.x && start.y > current.y) {
      AABB.lowerBound = {x: start.x / self.scale, y: current.y / self.scale};
      AABB.upperBound = {x: current.x / self.scale, y: start.y / self.scale};
    } else if (start.x > current.x && start.y > current.y) {
      AABB.lowerBound = {x: current.x / self.scale, y: current.y / self.scale};
      AABB.upperBound = {x: start.x / self.scale, y: start.y / self.scale};
    } else {
      AABB.lowerBound = {x: start.x / self.scale, y: start.y / self.scale};
      AABB.upperBound = {x: current.x / self.scale, y: current.y / self.scale};
    }
    self.world.QueryAABB(function (fixture) {
      fixtures.push(fixture);
      return true;
    }, AABB);
    return fixtures;
  };

  self.queryPoint = function (point, callback) {
    self.world.QueryPoint(
      function (fixture) {
        callback(fixture);
        return true; // continue quering for the next fixture.
      },
      {x: point.x, y: point.y}
    );
  };

  self.rayCastOne = function (pointA, pointB) {
    return self.world.RayCastOne(
      {x: pointA.x / self.scale, y: pointA.y / self.scale},
      {x: pointB.x / self.scale, y: pointB.y / self.scale}
    );
  };

  self.rayCastAll = function (pointA, pointB) {
    return self.world.RayCastOne(
      {x: pointA.x / self.scale, y: pointA.y / self.scale},
      {x: pointB.x / self.scale, y: pointB.y / self.scale}
    );
  };

  self.rayCast = function (pointA, pointB, callback) {
    self.world.RayCast(
      callback,
      {x: pointA.x / self.scale, y: pointA.y / self.scale},
      {x: pointB.x / self.scale, y: pointB.y / self.scale}
    );
  };

  // ---------------------------------------------------------------------- body

  self.addBody = function (x, y, type, bodyDefinition) {
    bodyDefinition = bodyDefinition || {};
    var bodyDef = new b2BodyDef();
    bodyDef.position.x = x / self.scale;
    bodyDef.position.y = y / self.scale;
    bodyDef.active = bodyDefinition.active ? bodyDefinition.active : true;
    bodyDef.allowSleep = bodyDefinition.allowSleep ? bodyDefinition.allowSleep : true;
    bodyDef.awake = bodyDefinition.awake ? bodyDefinition.awake : true;
    bodyDef.bullet = bodyDefinition.bullet ? bodyDefinition.bullet : false;
    bodyDef.fixedRotation = bodyDefinition.fixedRotation ? bodyDefinition.fixedRotation : false;
    bodyDef.angle = bodyDefinition.angle || bodyDefinition.angle === 0 ? bodyDefinition.angle : 0;
    bodyDef.angularDamping = bodyDefinition.angularDamping || bodyDefinition.angularDamping === 0 ? bodyDefinition.angularDamping : 0;
    bodyDef.angularVelocity = bodyDefinition.angularVelocity || bodyDefinition.angularVelocity === 0 ? bodyDefinition.angularVelocity : 0;
    bodyDef.linearDamping = bodyDefinition.linearDamping || bodyDefinition.linearDamping === 0 ? bodyDefinition.linearDamping : 0;
    bodyDef.linearVelocity = bodyDefinition.linearVelocity ? bodyDefinition.linearVelocity : {x: 0, y: 0};
    bodyDef.userData = bodyDefinition.userData ? bodyDefinition.userData : null;
    if (type === 'static') {
      bodyDef.type = b2Body.b2_staticBody;
    }
    if (type === 'dynamic') {
      bodyDef.type = b2Body.b2_dynamicBody;
    }
    if (type === 'kinematic') {
      bodyDef.type = b2Body.b2_kinematicBody;
    }

    var body = self.world.CreateBody(bodyDef);
    body.draggable = false;

    body.addCircle = function (radius, offsetX, offsetY, fixtureDefinition) {
      var fixtureDef = self.getFixtureDef(fixtureDefinition);
      fixtureDef.shape = new b2CircleShape(radius / self.scale);
      fixtureDef.shape.m_p = {
        x: offsetX / self.scale || 0,
        y: offsetY / self.scale || 0
      };
      return body.CreateFixture(fixtureDef);
    };

    body.addRectangle = function (width, height, offsetX, offsetY, fixtureDefinition) {
      var fixtureDef = self.getFixtureDef(fixtureDefinition);
      fixtureDef.shape = new b2PolygonShape();
      fixtureDef.shape.SetAsBox(
        width * 0.5 / self.scale,
        height * 0.5 / self.scale
      );
      self.fasterEach(fixtureDef.shape.m_vertices, function (vert) {
        vert.x += offsetX / self.scale || 0;
        vert.y += offsetY / self.scale || 0;
      }.bind(this));
      fixtureDef.shape.m_centroid.x += offsetX / self.scale || 0;
      fixtureDef.shape.m_centroid.y += offsetY / self.scale || 0;
      return body.CreateFixture(fixtureDef);
    };

    body.addPolygon = function (offsetX, offsetY, points, fixtureDefinition) {
      var fixtureDef = self.getFixtureDef(fixtureDefinition);
      fixtureDef.shape = new b2PolygonShape();
      self.fasterEach(points, function (point) {
        point.x /= self.scale;
        point.y /= self.scale;
      });
      fixtureDef.shape.SetAsArray(points, points.length);
      self.fasterEach(fixtureDef.shape.m_vertices, function (vert) {
        vert.x += offsetX / self.scale || 0;
        vert.y += offsetY / self.scale || 0;
      });
      return body.CreateFixture(fixtureDef);
    };

    body.addEdge = function (x1, y1, x2, y2, fixtureDefinition) {
      var fixtureDef = self.getFixtureDef(fixtureDefinition);
      fixtureDef.shape = new b2PolygonShape();
      x1 /= self.scale;
      y1 /= self.scale;
      x2 /= self.scale;
      y2 /= self.scale;
      fixtureDef.shape.SetAsEdge({x: x1, y: y1}, {x: x2, y: y2});
      return body.CreateFixture(fixtureDef);
    };

    body.applyForce = function (force, point) {
      body.ApplyForce({
        x: force.x / self.scale,
        y: force.y / self.scale
      }, {
        x: point.x / self.scale,
        y: point.y / self.scale
      });
    };

    body.applyImpulse = function (impulse, point) {
      body.ApplyImpulse({
        x: impulse.x / self.scale,
        y: impulse.y / self.scale
      }, {
        x: point.x / self.scale,
        y: point.y / self.scale
      });
    };

    body.applyTorque = function (torque) {
      body.ApplyTorque(torque / self.scale);
    };

    body.getAngle = function () {
      return body.GetAngle();
    };

    body.getMass = function () {
      return body.GetMass() * self.scale;
    };

    body.getWorldCenter = function () {
      return {
        x: body.GetWorldCenter().x * self.scale,
        y: body.GetWorldCenter().y * self.scale
      };
    };

    body.getPosition = function () {
      return {
        x: body.GetPosition().x * self.scale,
        y: body.GetPosition().y * self.scale
      };
    };

    body.onContactBegin = function (myfixture, otherFixture) {};
    body.onContactEnd = function (myfixture, otherFixture) {};
    body.onContactPreSolve = function (myfixture, otherFixture) {};
    body.onContactPostSolve = function (myfixture, otherFixture) {};
    body.onDragStart = function () {};
    body.onDragMove = function () {};
    body.onDragEnd = function () {};

    body.setAngularVelocity = function (angularVelocity) {
      body.SetAwake(true);
      body.SetAngularVelocity(angularVelocity / self.scale);
    };

    body.setLinearVelocity = function (x, y) {
      body.SetAwake(true);
      body.SetLinearVelocity({
        x: x / self.scale,
        y: y / self.scale
      });
    };
    return body;
  };

  self.getFixtureDef = function (fixtureDefinition) {
    fixtureDefinition = fixtureDefinition || {};
    var fixDef = new b2FixtureDef();
    fixDef.density = fixtureDefinition.density || fixtureDefinition.density === 0 ? fixtureDefinition.density : 1;
    fixDef.friction = fixtureDefinition.friction || fixtureDefinition.friction === 0 ? fixtureDefinition.friction : 0.5;
    fixDef.restitution = fixtureDefinition.restitution || fixtureDefinition.restitution === 0 ? fixtureDefinition.restitution : 0.3;
    fixDef.isSensor = fixtureDefinition.isSensor ? fixtureDefinition.isSensor : false;
    fixDef.userData = fixtureDefinition.userData ? fixtureDefinition.userData : null;
    return fixDef;
  };

  // ------------------------------------------------------------- drag and drop

  self.dragStart = function (pointer) {
    self.queryPoint(
      self.parseVector(pointer.x, pointer.y),
      function (fixture) {
        if (fixture.GetBody().draggable) {
          fixture.GetBody().onDragStart();
          self.mouseJoints.push(
            {
              number: pointer.number,
              body: fixture.GetBody(),
              joint: null
            }
          );
        }
      }
    );
  };

  self.dragMove = function (pointer) {
    self.fasterEach(self.mouseJoints, function (mouseJoint) {
      if (mouseJoint.number === pointer.number) {
        if (!mouseJoint.body) {
          return;
        }
        if (!mouseJoint.joint) {
          mouseJoint.joint = self.createMouseJoint(
            self.parseVector(pointer.x, pointer.y),
            mouseJoint.body
          );
        }
        mouseJoint.joint.SetTarget(
          self.parseVector(pointer.x, pointer.y)
        );
        mouseJoint.body.onDragMove();
      }
    });
  };

  self.dragEnd = function (pointer) {
    self.fasterEach(self.mouseJoints, function (mouseJoint) {
      mouseJoint.body.onDragEnd();
      if (mouseJoint.number === pointer.number) {
        mouseJoint.body = null;
        self.destroyJoint(mouseJoint.joint);
        mouseJoint.joint = null;
        var index = self.mouseJoints.indexOf(mouseJoint);
        if (index > -1) {
          self.mouseJoints.splice(index, 1);
        }
      }
    });
  };

  // -------------------------------------------------------------------- joints

  self.createMouseJoint = function (point, body, fps) {
    var jointDefinition = new Box2D.Dynamics.Joints.b2MouseJointDef();
    jointDefinition.bodyA = self.world.GetGroundBody();
    jointDefinition.bodyB = body;
    jointDefinition.target.Set(point.x, point.y);
    jointDefinition.maxForce = 100000;
    jointDefinition.timeStep = 1 / fps;
    return self.world.CreateJoint(jointDefinition);
  };

  self.createDistanceJoint = function (bodyA, bodyB, length, ax, ay, bx, by, frequencyHz, damping, collideConnected) {
    ax = ax || ax === 0 ? ax / self.scale : 0;
    ay = ay || ay === 0 ? ay / self.scale : 0;
    bx = bx || bx === 0 ? bx / self.scale : 0;
    by = by || by === 0 ? by / self.scale : 0;
    var jointDefinition = new Box2D.Dynamics.Joints.b2DistanceJointDef();
    jointDefinition.Initialize(
      bodyA,
      bodyB,
      {x: bodyA.GetWorldCenter().x + (ax), y: bodyA.GetWorldCenter().y + (ay)},
      {x: bodyB.GetWorldCenter().x + (bx), y: bodyB.GetWorldCenter().y + (by)}
    );
    jointDefinition.length = length || length === 0 ? length / self.scale : jointDefinition.length;
    jointDefinition.frequencyHz = frequencyHz || frequencyHz === 0 ? frequencyHz : jointDefinition.frequencyHz;
    jointDefinition.damping = damping || damping === 0 ? damping : jointDefinition.damping;
    jointDefinition.collideConnected = collideConnected ? collideConnected : jointDefinition.collideConnected;
    return self.world.CreateJoint(jointDefinition);
  };

  self.createRevoluteJoint = function (bodyA, bodyB, ax, ay, bx, by, motorSpeed, maxMotorTorque, enableMotor, lowerAngle, upperAngle, enableLimit, collideConnected) {
    var jointDefinition = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
    jointDefinition.Initialize(
      bodyA,
      bodyB,
      bodyA.GetWorldCenter()
    );
    ax = ax || ax === 0 ? ax / self.scale : 0;
    ay = ay || ay === 0 ? ay / self.scale : 0;
    bx = bx || bx === 0 ? bx / self.scale : 0;
    by = by || by === 0 ? by / self.scale : 0;
    jointDefinition.localAnchorA = {x: ax, y: ay};
    jointDefinition.localAnchorB = {x: bx, y: by};
    jointDefinition.motorSpeed = motorSpeed || motorSpeed === 0 ? motorSpeed * 0.0174532925199432957 : 0;
    jointDefinition.lowerAngle = lowerAngle || lowerAngle === 0 ? lowerAngle * 0.0174532925199432957 : 0;
    jointDefinition.upperAngle = upperAngle || upperAngle === 0 ? upperAngle * 0.0174532925199432957 : 0;
    jointDefinition.maxMotorTorque = maxMotorTorque || maxMotorTorque === 0 ? maxMotorTorque : 0;
    jointDefinition.enableMotor = enableMotor ? enableMotor : false;
    jointDefinition.enableLimit = enableLimit ? enableLimit : false;
    jointDefinition.collideConnected = collideConnected ? collideConnected : false;
    return self.world.CreateJoint(jointDefinition);
  };

  self.createPrismaticJoint = function (bodyA, bodyB, axisX, axisY, ax, ay, bx, by, lowerTranslation, upperTranslation, enableLimit, motorSpeed, maxMotorForce, enableMotor, collideConnected) {
    axisX = axisX || axisX === 0 ? axisX : 0;
    axisY = axisY || axisY === 0 ? axisY : 0;
    var jointDefinition = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
    jointDefinition.Initialize(
      bodyA,
      bodyB,
      bodyA.GetWorldCenter(),
      {x: axisX, y: axisY}
    );
    ax = ax || ax === 0 ? ax / self.scale : 0;
    ay = ay || ay === 0 ? ay / self.scale : 0;
    bx = bx || bx === 0 ? bx / self.scale : 0;
    by = by || by === 0 ? by / self.scale : 0;
    jointDefinition.localAnchorA = {x: ax, y: ay};
    jointDefinition.localAnchorB = {x: bx, y: by};
    jointDefinition.lowerTranslation = lowerTranslation || lowerTranslation === 0 ? lowerTranslation / self.scale : 0;
    jointDefinition.upperTranslation = upperTranslation || upperTranslation === 0 ? upperTranslation / self.scale : 0;
    jointDefinition.enableLimit = enableLimit ? enableLimit : false;
    jointDefinition.motorSpeed = motorSpeed || motorSpeed === 0 ? motorSpeed * 0.0174532925199432957 : 0;
    jointDefinition.maxMotorForce = maxMotorForce || maxMotorForce === 0 ? maxMotorForce : 0;
    jointDefinition.enableMotor = enableMotor ? enableMotor : false;
    jointDefinition.collideConnected = collideConnected ? collideConnected : false;
    return self.world.CreateJoint(jointDefinition);
  };

  self.createPulleyJoint = function (bodyA, bodyB, groundAnchorAX, groundAnchorAY, groundAnchorBX, groundAnchorBY, offsetAX, offsetAY, offsetBX, offsetBY, ratio, lengthA, lengthB) {
    var jointDefinition = new Box2D.Dynamics.Joints.b2PulleyJointDef();
    jointDefinition.Initialize(
      bodyA,
      bodyB,
      {x: groundAnchorAX / self.scale, y: groundAnchorAY / self.scale},
      {x: groundAnchorBX / self.scale, y: groundAnchorBY / self.scale},
      {x: bodyA.GetWorldCenter().x + offsetAX / self.scale, y: bodyA.GetWorldCenter().y + offsetAY / self.scale},
      {x: bodyB.GetWorldCenter().x + offsetBX / self.scale, y: bodyB.GetWorldCenter().y + offsetBY / self.scale},
      ratio
    );
    jointDefinition.lengthA = lengthA / self.scale;
    jointDefinition.lengthB = lengthB / self.scale;
    jointDefinition.maxLengthA = (lengthA / self.scale + lengthB / self.scale) * 2;
    jointDefinition.maxLengthB = (lengthA / self.scale + lengthB / self.scale) * 2;
    var pulleyJoint = self.world.CreateJoint(jointDefinition);
    pulleyJoint.m_maxLength1 = pulleyJoint.m_constant;
    pulleyJoint.m_maxLength2 = pulleyJoint.m_constant;
    return pulleyJoint;
  };

  self.destroyJoint = function (joint) {
    self.world.DestroyJoint(joint);
  };

  self.update = function (fps) {
    self.world.Step(1 / fps, 8, 3);
    self.world.ClearForces();
  };

  self.draw = function () {
    if (!self.debugDraw) {
      var debugDraw = new b2DebugDraw();
      debugDraw.SetSprite(self.game.canvas.context);
      debugDraw.SetDrawScale(self.scale);
      debugDraw.SetFillAlpha(0.5);
      debugDraw.SetFillAlpha(0.5);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit);
      debugDraw.AppendFlags(b2DebugDraw.e_jointBit);
      self.world.SetDebugDraw(debugDraw);
      self.world.m_debugDraw.m_sprite.graphics.clear = function () {
        return false;
      };
    }

    self.game.canvas.clear();
    self.game.canvas.context.save();

    self.game.canvas.context.scale(self.game.camera.zoom, self.game.camera.zoom);
    self.game.canvas.context.translate(-self.game.camera.x, -self.game.camera.y);
    self.game.canvas.context.rotate(-self.game.camera.angle);

    self.world.DrawDebugData();
    self.game.canvas.context.restore();
  };

  self.parseVector = function (x, y) {
    var parsedVector =  {
      x: (x + self.game.camera.x * self.game.camera.zoom) / self.scale / self.game.camera.zoom,
      y: (y + self.game.camera.y * self.game.camera.zoom) / self.scale / self.game.camera.zoom
    };
    parsedVector = {
      x: parsedVector.x * Math.cos(self.game.camera.angle) - parsedVector.y * Math.sin(self.game.camera.angle),
      y: parsedVector.x * Math.sin(self.game.camera.angle) + parsedVector.y * Math.cos(self.game.camera.angle)
    };
    return parsedVector;
  };

};
