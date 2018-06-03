var game = new comp.game();
game.states.add(testState);
game.states.switch('test');
game.loop.start();
