var assert = require('assert');
var assetsCounter = 0;
var queueCounter = 0;

Feature('Loader');

Scenario('Should load Audio', async function (I) {
  I.amOnPage('loader.html');
  I.waitForText('DOM READY');
  assetsCounter = await I.grabTextFrom('.assets-counter');
  assert.equal(assetsCounter, 0);
  I.click('.load-audio');
  I.waitForElement('.tic', 3);
  assetsCounter = await I.grabTextFrom('.assets-counter');
  assert.equal(assetsCounter, 1);
});

Scenario('Should load Images', async function (I) {
  I.amOnPage('loader.html');
  I.waitForText('DOM READY');
  assetsCounter = await I.grabTextFrom('.assets-counter');
  assert.equal(assetsCounter, 0);
  I.click('.load-image');
  I.waitForElement('.brick', 3);
  assetsCounter = await I.grabTextFrom('.assets-counter');
  assert.equal(assetsCounter, 1);
});

Scenario('Should load JSON', async function (I) {
  I.amOnPage('loader.html');
  I.waitForText('DOM READY');
  assetsCounter = await I.grabTextFrom('.assets-counter');
  assert.equal(assetsCounter, 0);
  I.click('.load-json');
  I.waitForText('{"name":"John","age":31,"city":"New York"}', 3);
  assetsCounter = await I.grabTextFrom('.assets-counter');
  assert.equal(assetsCounter, 1);
});

Scenario('Should add audio to the queue', async function (I) {
  I.amOnPage('loader.html');
  I.waitForText('DOM READY');
  queueCounter = await I.grabTextFrom('.queue-counter');
  assert.equal(queueCounter, 0);
  I.click('.add-audio');
  queueCounter = await I.grabTextFrom('.queue-counter');
  assert.equal(queueCounter, 1);
});

Scenario('Should add an image to the queue', async function (I) {
  I.amOnPage('loader.html');
  I.waitForText('DOM READY');
  queueCounter = await I.grabTextFrom('.queue-counter');
  assert.equal(queueCounter, 0);
  I.click('.add-image');
  queueCounter = await I.grabTextFrom('.queue-counter');
  assert.equal(queueCounter, 1);
});

Scenario('Should add JSON to the queue', async function (I) {
  I.amOnPage('loader.html');
  I.waitForText('DOM READY');
  queueCounter = await I.grabTextFrom('.queue-counter');
  assert.equal(queueCounter, 0);
  I.click('.add-json');
  queueCounter = await I.grabTextFrom('.queue-counter');
  assert.equal(queueCounter, 1);
});
