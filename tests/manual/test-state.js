var testState = new comp.state('test');

testState.preload = function (game) {
  console.log('preload');
}

testState.create = function (game) {
  console.log('create');
}

testState.update = function (game) {
  console.log('update');
}