var assert = require('assert');
var value = '';

Feature('Loader');

Scenario('Should load JSON', async function (I) {
  I.amOnPage('loader.html');
  I.waitForElement('.ready');
  I.wait(1);
  I.click('.load-json');
  I.waitForText('{"name":"John","age":31,"city":"New York"}', 5, '.value');
  value = await I.grabTextFrom('.value');
  assert.strictEqual(value, '{"name":"John","age":31,"city":"New York"}');
});

Scenario('Should load Images', async function (I) {
  I.amOnPage('loader.html');
  I.waitForElement('.ready');
  I.wait(1);
  I.click('.load-image');
  I.waitForElement('.brick');
});

Scenario('Should load Images', async function (I) {
  I.amOnPage('loader.html');
  I.waitForElement('.ready');
  I.wait(1);
  I.click('.load-audio');
  I.waitForElement('.tic');
});
