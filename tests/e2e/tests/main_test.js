var assert = require('assert');

Feature('Test index.html');

Scenario('Page title must be "seed"', async function (I) {
  I.amOnPage('/');
  I.wait(2);
  I.seeElement('h1');
  var title = await I.grabTitle();
  assert.deepEqual(title, 'seed');
});
