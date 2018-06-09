var cherry = require('../../dist/cherry');
var signal = new cherry.signal();

describe('Signal', function () {
  it('should have correct inital values', function () {
    expect(signal.getTest()).toBe(null);
  });
  it('should functional public setters and getters', function () {
    expect(signal.getTest()).toBe(null);
  });
  // it('should add listener', function () {
  // expect(signal.getTest()).toBe(null);
  // });
  // it('should dispatch signal passing custom parameters', function () {
  // expect(signal.getTest()).toBe(null);
  // });
  // it('should remove a single listener', function () {
  // expect(signal.getTest()).toBe(null);
  // });
  // it('should remove all listeners', function () {
  // expect(signal.getTest()).toBe(null);
  // });
  // it('should add one time listener', function () {
  // expect(signal.getTest()).toBe(null);
  // });
  // it('should disable', function () {
  // expect(signal.getTest()).toBe(null);
  // });
  // it('should enable', function () {
  // expect(signal.getTest()).toBe(null);
  // });
  // it('should prevent next listeners on the queue from being executed', function () {
  // expect(signal.getTest()).toBe(null);
  // });
  // it('should execute by priority', function () {
  // expect(signal.getTest()).toBe(null);
  // });
  // it('should disable signal binding', function () {
  // expect(signal.getTest()).toBe(null);
  // });
  // it('should enable signal binding', function () {
  // expect(signal.getTest()).toBe(null);
  // });
});
