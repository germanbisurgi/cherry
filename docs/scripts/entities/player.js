var Player = function (image, x, y, w, h, a) {
  this.img = game.loader.getImage(image);
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 32;
  this.h = h || 32;
  this.a = a || 0;
  this.body = game.physics.addBody(50, 50, 'dynamic');
  this.body.addRectangle(0, 0, 30, 30);
  this.body.draggable = true;
};

Player.prototype.update = function (game) {

  if (game.keys.keys['ArrowUp'].isHolded) {
    this.body.applyForce({x: 0, y: -200}, this.body.getWorldCenter());
  }
  if (game.keys.keys['ArrowRight'].isHolded) {
    this.body.applyForce({x: 200, y: 0}, this.body.getWorldCenter());
  }
  if (game.keys.keys['ArrowDown'].isHolded) {
    this.body.applyForce({x: 0, y: 200}, this.body.getWorldCenter());
  }
  if (game.keys.keys['ArrowLeft'].isHolded) {
    this.body.applyForce({x: -200, y: 0}, this.body.getWorldCenter());
  }

  this.x = this.body.getPosition().x;
  this.y = this.body.getPosition().y;
  this.a = this.body.getAngle();
};

Player.prototype.draw = function (canvas) {
  canvas.context.save();
  canvas.context.translate(this.x, this.y);
  canvas.context.rotate(this.a);
  canvas.image(this.img, 0, 0, this.w, this.h);
  canvas.context.restore();
};
