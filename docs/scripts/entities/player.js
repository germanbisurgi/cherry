var Player = function (game) {
  this.body = game.physics.addBody(50, 50, 'dynamic');
  this.body.addRectangle(50, 50);
  this.body.onContactBegin = function () {
    console.log('contact begin')
  };
  this.renderable = game.render.addRenderable(game.assets.getImage('brick'), 50, 50, 50, 50, 0);
};

Player.prototype.update = function () {
  this.renderable.x = this.body.getPosition().x;
  this.renderable.y = this.body.getPosition().y;
  this.renderable.angle = this.body.getAngle();
};
