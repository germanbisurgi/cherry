window.addEventListener('load', function () {

  var game = new comp.game();
  var canvas = document.querySelector('canvas');
  var context = canvas.getContext('2d');
  var entity = {x: 0, y: 0, width: 50, height: 50};
  game.loop.update = function (delta) {
    // update
    entity.x += 1 * delta * 60 / 1000;
    // draw
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.rect(
      entity.x,
      entity.y,
      entity.width,
      entity.height
    );
    context.stroke();
    context.closePath();

  };

  game.loop.setFps(60);
  game.loop.start();

});
