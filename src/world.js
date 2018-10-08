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

var World = function () {
  'use strict';
  var self = this;
  self.scale = 100; // how many pixels is 1 meter
  self.world = new b2World(new b2Vec2(0, 0), true);
  self.bodies = [];
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

  self.setGravity = function (_x, _y) {
    self.world.SetGravity(new b2Vec2(_x, _y));
  };

  self.fasterEach = function (array, fn, thisContext) {
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

  self.queryPoint = function (_point, _function) {
    self.world.QueryPoint(
      function (fixture) {
        _function(fixture);
      },
      {x: _point.x, y: _point.y}
    );
  };

  self.rayCastOne = function (_pointA, _pointB) {
    return self.world.RayCastOne(
      {x: _pointA.x / self.scale, y: _pointA.y / self.scale},
      {x: _pointB.x / self.scale, y: _pointB.y / self.scale}
    );
  };

  self.rayCastAll = function (_pointA, _pointB) {
    return self.world.RayCastOne(
      {x: _pointA.x / self.scale, y: _pointA.y / self.scale},
      {x: _pointB.x / self.scale, y: _pointB.y / self.scale}
    );
  };

  self.rayCast = function (_pointA, _pointB, _callback) {
    self.world.RayCast(
      _callback,
      {x: _pointA.x / self.scale, y: _pointA.y / self.scale},
      {x: _pointB.x / self.scale, y: _pointB.y / self.scale}
    );
  };

  // ---------------------------------------------------------------------- body

  self.addBody = function (_x, _y, _type, _bodyDefinition) {
    _bodyDefinition = _bodyDefinition || {};
    var bodyDef = new b2BodyDef();
    bodyDef.position.x = _x / self.scale;
    bodyDef.position.y = _y / self.scale;
    bodyDef.active = _bodyDefinition.active ? _bodyDefinition.active : true;
    bodyDef.allowSleep = _bodyDefinition.allowSleep ? _bodyDefinition.allowSleep : true;
    bodyDef.awake = _bodyDefinition.awake ? _bodyDefinition.awake : true;
    bodyDef.bullet = _bodyDefinition.bullet ? _bodyDefinition.bullet : false;
    bodyDef.fixedRotation = _bodyDefinition.fixedRotation ? _bodyDefinition.fixedRotation : false;
    bodyDef.angle = _bodyDefinition.angle || _bodyDefinition.angle === 0 ? _bodyDefinition.angle : 0;
    bodyDef.angularDamping = _bodyDefinition.angularDamping || _bodyDefinition.angularDamping === 0 ? _bodyDefinition.angularDamping : 0;
    bodyDef.angularVelocity = _bodyDefinition.angularVelocity || _bodyDefinition.angularVelocity === 0 ? _bodyDefinition.angularVelocity : 0;
    bodyDef.linearDamping = _bodyDefinition.linearDamping || _bodyDefinition.linearDamping === 0 ? _bodyDefinition.linearDamping : 0;
    bodyDef.linearVelocity = _bodyDefinition.linearVelocity ? _bodyDefinition.linearVelocity : {x: 0, y: 0};
    bodyDef.userData = _bodyDefinition.userData ? _bodyDefinition.userData : null;
    if (_type === 'static') {
      bodyDef.type = b2Body.b2_staticBody;
    }
    if (_type === 'dynamic') {
      bodyDef.type = b2Body.b2_dynamicBody;
    }
    if (_type === 'kinematic') {
      bodyDef.type = b2Body.b2_kinematicBody;
    }

    var body = self.world.CreateBody(bodyDef);
    body.draggable = true;

    body.addCircle = function (_offsetX, _offsetY, _radius, _fixtureDefinition) {
      var fixtureDef = self.getFixtureDef(_fixtureDefinition);
      fixtureDef.shape = new b2CircleShape(_radius / self.scale);
      fixtureDef.shape.m_p = {
        x: _offsetX / self.scale || 0,
        y: _offsetY / self.scale || 0
      };
      var fixture = body.CreateFixture(fixtureDef);
      return fixture;
    };

    body.addRectangle = function (_offsetX, _offsetY, _width, _height, _fixtureDefinition) {
      var fixtureDef = self.getFixtureDef(_fixtureDefinition);
      fixtureDef.shape = new b2PolygonShape();
      fixtureDef.shape.SetAsBox(
        _width * 0.5 / self.scale,
        _height * 0.5 / self.scale
      );
      self.fasterEach(fixtureDef.shape.m_vertices, function (_vert) {
        _vert.x += _offsetX / self.scale || 0;
        _vert.y += _offsetY / self.scale || 0;
      }.bind(this));
      fixtureDef.shape.m_centroid.x += _offsetX / self.scale || 0;
      fixtureDef.shape.m_centroid.y += _offsetY / self.scale || 0;
      var fixture = body.CreateFixture(fixtureDef);
      return fixture;
    };

    body.addPolygon = function (_offsetX, _offsetY, _points, _fixtureDefinition) {
      var fixtureDef = self.getFixtureDef(_fixtureDefinition);
      fixtureDef.shape = new b2PolygonShape();
      self.fasterEach(_points, function (_point) {
        _point.x /= self.scale;
        _point.y /= self.scale;
      });
      fixtureDef.shape.SetAsArray(_points, _points.length);
      self.fasterEach(fixtureDef.shape.m_vertices, function (_vert) {
        _vert.x += _offsetX / self.scale || 0;
        _vert.y += _offsetY / self.scale || 0;
      });
      var fixture = body.CreateFixture(fixtureDef);
      return fixture;
    };

    body.addEdge = function (_x1, _y1, _x2, _y2, _fixtureDefinition) {
      var fixtureDef = self.getFixtureDef(_fixtureDefinition);
      fixtureDef.shape = new b2PolygonShape();
      _x1 /= self.scale;
      _y1 /= self.scale;
      _x2 /= self.scale;
      _y2 /= self.scale;
      fixtureDef.shape.SetAsEdge({x: _x1, y: _y1}, {x: _x2, y: _y2});
      var fixture = body.CreateFixture(fixtureDef);
      return fixture;
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

    body.getAngle = function (force, point) {
      return body.GetAngle();
    };

    body.getMass = function (force, point) {
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

    body.setAngularVelocity = function (angularVelocity) {
      body.SetAwake(true);
      body.SetAngularVelocity(angularVelocity / self.scale);
    };

    body.setLinearVelocity = function (_x, _y) {
      body.SetAwake(true);
      body.SetLinearVelocity({
        x: _x / self.scale,
        y: _y / self.scale
      });
    };

    self.bodies.push(body);

    return body;
  };

  self.getFixtureDef = function (_fixtureDefinition) {
    _fixtureDefinition = _fixtureDefinition || {};
    var fixDef = new b2FixtureDef();
    fixDef.density = _fixtureDefinition.density || _fixtureDefinition.density === 0 ? _fixtureDefinition.density : 1;
    fixDef.friction = _fixtureDefinition.friction || _fixtureDefinition.friction === 0 ? _fixtureDefinition.friction : 0.5;
    fixDef.restitution = _fixtureDefinition.restitution || _fixtureDefinition.restitution === 0 ? _fixtureDefinition.restitution : 0.3;
    fixDef.isSensor = _fixtureDefinition.isSensor ? _fixtureDefinition.isSensor : false;
    fixDef.userData = _fixtureDefinition.userData ? _fixtureDefinition.userData : null;
    return fixDef;
  };

  self.update = function (fps) {
    self.world.Step(1 / fps, 8, 3);
    self.world.ClearForces();
  };

  self.draw = function (context) {
    if (!self.debugDraw) {
      var debugDraw = new b2DebugDraw();
      debugDraw.SetSprite(context);
      debugDraw.SetDrawScale(self.scale);
      debugDraw.SetFillAlpha(0.5);
      debugDraw.SetFillAlpha(0.5);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit);
      // debugDraw.SetFlags(b2DebugDraw.e_aabbBit);
      // debugDraw.AppendFlags(b2DebugDraw.e_centerOfMassBit);
      debugDraw.AppendFlags(b2DebugDraw.e_jointBit);
      self.world.SetDebugDraw(debugDraw);
      self.world.m_debugDraw.m_sprite.graphics.clear = function () {
        return false;
      };
    }
    context.save();
    self.world.DrawDebugData();
    context.restore();
  };

  self.clear = function () {
    self.fasterEach(self.bodies, function (body) {
      body.GetWorld().DestroyBody(body);
    });
    self.bodies = [];
    self.mouseJoints = [];
  };

  self.vector = function (x, y) {
    return {
      x: (x) / self.scale,
      y: (y) / self.scale
    };

    /* return {
			x: (x + game.render.camera.x) / self.scale,
			y: (y + game.render.camera.y) / self.scale
		}
		var x = (_x + game.render.camera.x)/ self.scale;
		var y = (_y + game.render.camera.y)/ self.scale;
		var angle = game.render.camera.angle;
		var ox = (game.render.camera.x + game.render.camera.width / 2)/ self.scale;
		var oy = (game.render.camera.x + game.render.camera.height / 2)/ self.scale;
		var radius = game.mathematics.distance(x, y, ox, oy)/ self.scale;
		return game.mathematics.angleToPoint(angle, ox, oy, radius); */
  };

  // ------------------------------------------------------------- drag and drop

  self.dragStart = function (pointer) {
    self.queryPoint(
      self.vector(
        pointer.x,
        pointer.y
      ),
      function (fixture) {
        if (fixture.GetBody().draggable) {
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
            self.vector(
              pointer.x,
              pointer.y
            ),
            mouseJoint.body
          );
        }
        mouseJoint.joint.SetTarget(
          self.vector(
            pointer.x,
            pointer.y
          )
        );
      }
    });
  };

  self.dragEnd = function (pointer) {
    self.fasterEach(self.mouseJoints, function (mouseJoint) {
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

  self.createMouseJoint = function (_point, _body, fps) {
    var jointDefinition = new Box2D.Dynamics.Joints.b2MouseJointDef();
    jointDefinition.bodyA = self.world.GetGroundBody();
    jointDefinition.bodyB = _body;
    jointDefinition.target.Set(_point.x, _point.y);
    jointDefinition.maxForce = 100000;
    jointDefinition.timeStep = 1 / fps;
    return self.world.CreateJoint(jointDefinition);
  };

  self.createDistanceJoint = function (_config) {
    var ax = _config.ax || _config.ax === 0 ? _config.ax / self.scale : 0;
    var ay = _config.ay || _config.ay === 0 ? _config.ay / self.scale : 0;
    var bx = _config.bx || _config.bx === 0 ? _config.bx / self.scale : 0;
    var by = _config.by || _config.by === 0 ? _config.by / self.scale : 0;
    var jointDefinition = new Box2D.Dynamics.Joints.b2DistanceJointDef();
    jointDefinition.Initialize(
      _config.bodyA,
      _config.bodyB,
      {x: _config.bodyA.GetWorldCenter().x + (ax), y: _config.bodyA.GetWorldCenter().y + (ay)},
      {x: _config.bodyB.GetWorldCenter().x + (bx), y: _config.bodyB.GetWorldCenter().y + (by)}
    );
    jointDefinition.length = _config.length || _config.length === 0 ? _config.length / self.scale : jointDefinition.length;
    jointDefinition.frequencyHz = _config.frequencyHz || _config.frequencyHz === 0 ? _config.frequencyHz : jointDefinition.frequencyHz;
    jointDefinition.damping = _config.damping || _config.damping === 0 ? _config.damping : jointDefinition.damping;
    jointDefinition.collideConnected = _config.collideConnected ? _config.collideConnected : jointDefinition.collideConnected;
    return self.world.CreateJoint(jointDefinition);
  };

  self.createRevoluteJoint = function (_config) {
    var jointDefinition = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
    jointDefinition.Initialize(
      _config.bodyA,
      _config.bodyB,
      _config.bodyA.GetWorldCenter()
    );
    var ax = _config.ax || _config.ax === 0 ? _config.ax / self.scale : 0;
    var ay = _config.ay || _config.ay === 0 ? _config.ay / self.scale : 0;
    var bx = _config.bx || _config.bx === 0 ? _config.bx / self.scale : 0;
    var by = _config.by || _config.by === 0 ? _config.by / self.scale : 0;
    jointDefinition.localAnchorA = {x: ax, y: ay};
    jointDefinition.localAnchorB = {x: bx, y: by};
    jointDefinition.motorSpeed = _config.motorSpeed || _config.motorSpeed === 0 ? _config.motorSpeed * 0.0174532925199432957 : 0;
    jointDefinition.lowerAngle = _config.lowerAngle || _config.lowerAngle === 0 ? _config.lowerAngle * 0.0174532925199432957 : 0;
    jointDefinition.upperAngle = _config.upperAngle || _config.upperAngle === 0 ? _config.upperAngle * 0.0174532925199432957 : 0;
    jointDefinition.maxMotorTorque = _config.maxMotorTorque || _config.maxMotorTorque === 0 ? _config.maxMotorTorque : 0;
    jointDefinition.enableMotor = _config.enableMotor ? _config.enableMotor : false;
    jointDefinition.enableLimit = _config.enableLimit ? _config.enableLimit : false;
    jointDefinition.collideConnected = _config.collideConnected ? _config.collideConnected : false;
    return self.world.CreateJoint(jointDefinition);
  };

  self.createPrismaticJoint = function (_config) {
    var axisX = _config.axisX || _config.axisX === 0 ? _config.axisX : 0;
    var axisY = _config.axisY || _config.axisY === 0 ? _config.axisY : 0;
    var jointDefinition = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
    jointDefinition.Initialize(
      _config.bodyA,
      _config.bodyB,
      _config.bodyA.GetWorldCenter(),
      {x: axisX, y: axisY}
    );
    var ax = _config.ax || _config.ax === 0 ? _config.ax / self.scale : 0;
    var ay = _config.ay || _config.ay === 0 ? _config.ay / self.scale : 0;
    var bx = _config.bx || _config.bx === 0 ? _config.bx / self.scale : 0;
    var by = _config.by || _config.by === 0 ? _config.by / self.scale : 0;
    jointDefinition.localAnchorA = {x: ax, y: ay};
    jointDefinition.localAnchorB = {x: bx, y: by};
    jointDefinition.lowerTranslation = _config.lowerTranslation || _config.lowerTranslation === 0 ? _config.lowerTranslation / self.scale : 0;
    jointDefinition.upperTranslation = _config.upperTranslation || _config.upperTranslation === 0 ? _config.upperTranslation / self.scale : 0;
    jointDefinition.enableLimit = _config.enableLimit ? _config.enableLimit : false;
    jointDefinition.motorSpeed = _config.motorSpeed || _config.motorSpeed === 0 ? _config.motorSpeed * 0.0174532925199432957 : 0;
    jointDefinition.maxMotorForce = _config.maxMotorForce || _config.maxMotorForce === 0 ? _config.maxMotorForce : 0;
    jointDefinition.enableMotor = _config.enableMotor ? _config.enableMotor : false;
    jointDefinition.collideConnected = _config.collideConnected ? _config.collideConnected : false;
    return self.world.CreateJoint(jointDefinition);
  };

  self.createPulleyJoint = function (config) {
    var jointDefinition = new Box2D.Dynamics.Joints.b2PulleyJointDef();
    jointDefinition.Initialize(
      config.bodyA,
      config.bodyB,
      {x: config.groundAnchorA.x / self.scale, y: config.groundAnchorA.y / self.scale},
      {x: config.groundAnchorB.x / self.scale, y: config.groundAnchorB.y / self.scale},
      {x: config.bodyA.GetWorldCenter().x + config.offsetA.x / self.scale, y: config.bodyA.GetWorldCenter().y + config.offsetA.y / self.scale},
      {x: config.bodyB.GetWorldCenter().x + config.offsetB.x / self.scale, y: config.bodyB.GetWorldCenter().y + config.offsetB.y / self.scale},
      config.ratio
    );
    jointDefinition.lengthA = config.lengthA / self.scale;
    jointDefinition.lengthB = config.lengthB / self.scale;
    jointDefinition.maxLengthA = (config.lengthA / self.scale + config.lengthB / self.scale) * 2;
    jointDefinition.maxLengthB = (config.lengthA / self.scale + config.lengthB / self.scale) * 2;
    var pulleyJoint = self.world.CreateJoint(jointDefinition);
    pulleyJoint.m_maxLength1 = pulleyJoint.m_constant;
    pulleyJoint.m_maxLength2 = pulleyJoint.m_constant;
    return pulleyJoint;
  };

  self.destroyJoint = function (_joint) {
    self.world.DestroyJoint(_joint);
  };

};
