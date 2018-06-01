var ObjectPool = require('./object-pool.js');
var GameLoop = require('./game-loop.js');

var comp = {
  ObjectPool: ObjectPool,
  GameLoop: GameLoop
};

if (typeof module !== 'undefined') {
  module.exports = comp;
}
