window.addEventListener('load', function () {
  game = new naive.Game();
  game.state.add(testState);
  game.state.switch('test-state');

  game.loader.onStart.add(function () {
    // console.log('loader started');
  });

  game.loader.onQueued.add(function (asset) {
    // console.log('loader queued', asset);
  });

  game.loader.onLoad.add(function (asset) {
    // console.log('loader loaded', asset);
  });

  game.loader.onComplete.add(function () {
    // console.log('loader completed');
  });

  game.loop.start();

});
